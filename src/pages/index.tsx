import Head from 'next/head'
import { useState } from 'react'
import { Address, createWalletClient, custom, WalletClient, encodeFunctionData } from 'viem'
import { baseGoerli } from 'viem/chains'
import 'viem/window'
import styles from '@/styles/Home.module.css'
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import { ChainId } from "@biconomy/core-types"
import { IPaymaster, BiconomyPaymaster, IHybridPaymaster, SponsorUserOperationDto, PaymasterMode } from '@biconomy/paymaster'
import { WalletClientSigner } from "@alchemy/aa-core";
import abi from "@/utils/abi.json"


export default function Home() {

  const [ saAddress, setSaAddress ] = useState<string>()
  const [walletClient, setWalletClient] = useState<WalletClient>()
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | undefined>()


  const bundler: IBundler = new Bundler({
    bundlerUrl: "",    
    chainId: ChainId.BASE_GOERLI_TESTNET,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })


  
  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: ""
  })


  const connect = async () => {
    if(!window.ethereum) return
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })

    const client = createWalletClient({
    account,
    chain: baseGoerli,
    transport: custom(window.ethereum)
  })
  setWalletClient(client)
  }

  const createSmartAccount = async () => {
    if(!walletClient) return
    const signer = new WalletClientSigner(walletClient,"json-rpc" )
    const ownerShipModule = await ECDSAOwnershipValidationModule.create({
      signer: signer,
      moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
    })

    let biconomySmartAccount = await BiconomySmartAccountV2.create({
      chainId: ChainId.BASE_GOERLI_TESTNET,
      bundler: bundler,
      paymaster: paymaster,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
      defaultValidationModule: ownerShipModule,
      activeValidationModule: ownerShipModule
    })

    const address = await biconomySmartAccount.getAccountAddress();
    setSaAddress(address)
    setSmartAccount(biconomySmartAccount)
  }

  const mintNFT = async () => {

    try {
      const data = encodeFunctionData({
        abi: abi.abi,
        functionName: 'safeMint',
        args: [saAddress]
      })
  
      const tx1 = {
        to: "0x0a7755bDfb86109D9D403005741b415765EAf1Bc",
        data: data
      }
  
      let userOp = await smartAccount?.buildUserOp([tx1]);
        console.log({ userOp })
        const biconomyPaymaster = smartAccount?.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
        let paymasterServiceData: SponsorUserOperationDto = {
          mode: PaymasterMode.SPONSORED,
          smartAccountInfo: {
            name: 'BICONOMY',
            version: '2.0.0'
          }
        };

        const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
            userOp,
            paymasterServiceData
          );

        userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
        const userOpResponse = await smartAccount?.sendUserOp(userOp);
        console.log("userOpHash", userOpResponse);
        const { receipt } = await userOpResponse.wait(1);
        console.log("txHash", receipt.transactionHash);
    } catch (error) {
      console.error(error)
    }

  }

  return (
    <>
      <Head>
        <title>Biconomy + Viem Example</title>
        <meta name="description" content="Using Viem with Biconomy SDK" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Biconomy + Viem Starter Kit</h1>
        {walletClient ? (
        <>
          {saAddress && <h2>Connected Smart Account: {saAddress}</h2>}
          <button onClick={createSmartAccount}>Create Smart Account</button>
        </>
        ):(
          <button onClick={connect}>Connect Wallet</button>
        )}
        { smartAccount && <button onClick={mintNFT}>Mint NFT</button>}
      </main>
    </>
  )
}

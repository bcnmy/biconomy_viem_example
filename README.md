# Biconomy + Viem Example

This repository contains a Next.js project integrated with the Biconomy SDK and Viem. This demonstrates how to use Viem to help sign and send userOps(transactions) using Biconomy. 

## Prerequisites

Before running the project, you need to have Node.js and Yarn installed on your machine. Yarn is used as the primary package manager in this project, but you are free to use npm or other package managers if you prefer.

## Getting Started

To get the repository up and running on your local machine, follow these steps:

1. **Install Dependencies**

   Navigate to the root directory of the project in your terminal and run the following command to install the necessary dependencies:

   ```bash
   yarn install
   ```

2. **Biconomy Dashboard Configuration**

   You will need to update specific lines in the project to integrate with your Biconomy setup:
   
   In the `index.tsx` file:

   - On line 24, replace the placeholder with your Paymaster URL.
   - On line 32, replace the placeholder with your Bundler URL.

   Both URLs can be obtained from your Biconomy dashboard: https://dashboard.biconomy.io/

3. **Smart Contract Whitelisting**

   Ensure that the NFT contract address `0x0a7755bDfb86109D9D403005741b415765EAf1Bc`, which is deployed on the Base Goerli testnet, is whitelisted in your Biconomy dashboard.

4. **Function Authorization**

   Within the Biconomy dashboard, authorize the `safeMint` function for the whitelisted contract. This is necessary to enable the contract to interact seamlessly with Biconomy's services.

## Learn More

To understand more about configuring and utilizing the Biconomy dashboard, please refer to the official documentation:

[Biconomy Dashboard Documentation](https://docs.biconomy.io/category/biconomy-dashboard)

## Running the Project

Once you have completed the setup:

- Run the development server:

  ```bash
  yarn dev
  ```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



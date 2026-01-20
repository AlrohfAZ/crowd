# Crowdfunding Smart Contract

A decentralized crowdfunding platform built on **Ethereum**, allowing users to create campaigns, contribute funds, and withdraw raised funds after the campaign deadline. This contract is written in **Solidity** and compatible with **EVM-based blockchains**.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Deployment](#deployment)
- [Usage](#usage)
- [Contract Details](#contract-details)
- [Testing](#testing)
- [License](#license)

## Description

This smart contract enables users to:

- Launch crowdfunding campaigns with a title, description, image, target amount, minimum contribution, and deadline.
- Track all campaigns and their details.
- Accept contributions from multiple users.
- Withdraw funds after the campaign ends.

It is designed for **secure, transparent, and decentralized crowdfunding**, leveraging the blockchain to maintain trust.

## Features

- Create a crowdfunding campaign with a target amount and deadline.
- Set a minimum contribution per campaign.
- Track amount raised and contributors count.
- Fetch all active campaigns or specific campaign details.
- Withdraw campaign funds after the deadline.
- Event emission (`CampaignCreated`) for frontend integration.

## Tech Stack

- Solidity ^0.8.0
- Hardhat (for development & testing)
- Ethers.js (for interacting with the contract)
- Node.js & npm (for local development)

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd <repo-folder>
```
2. Install dependencies:
   ```npm install```

3. Configure environment variables:
   RPC_URL=<Your Ethereum Node URL>
   PRIVATE_KEY=<Your Wallet Private Key>

## Deployment
- npx hardhat run scripts/deploy.js --network <network-name>

## Usage
- Creating Campaign function:
  function createCampaign(
    string memory _title,
    string memory _description,
    string memory _imageURL,
    uint256 _targetAmount,
    uint256 _minimumContribution,
    uint256 _deadline
  ) public returns (uint256);

- Contributing function(minimum contribution is enforced):
  function contirbution(uint256 _campaignId) public payable returns (uint256 totalContributions);

- Withdrawal function:
  function withdrawFunds(uint256 _campaignId) public returns (uint256 amountRaised);

- Fetching campaign details functions:
  function getCampaignDetails(uint256 _campaignId)
    public
    view
    returns (address creator, string memory title, uint256 targetAmount, uint256 deadline, uint256 amountRaised);
  function getOngoingCampaignsSummary()
    public
    view
    returns (uint256[] memory campaignIdsArray, string[] memory titles, address[] memory creators, uint256[] memory targetAmounts, uint256[] memory deadlines);

## Contract Details
- Structs: Campaign(stores all campaign details)
- Mappings: campaigns to store campaigns by ID.
- Arrays: campaignIds to track all campaigns.
- Events: CampaignCreated to notify frontend of newCampaigns
- Security checks:
    Campaign deadline must be in the future.
    Minimum contribution ≤ target amount.
    Only the campaign creator can withdraw funds.

## Testing
- ```npx hardhat test```

## License
- This project is licensed under MIT.


## Frontend Integration

This section explains how to connect a frontend to the Crowdfunding smart contract using **Ethers.js**.


### 1. Install Dependencies

```bash
npm install ethers
```
if using react
```npm install react react-dom```

### 2. Connect to Ethereum
`import {BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
// Prompt user to connect wallet
useEffect(() => {
    async function initEthers() {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);
          // ETHERS V6 SYNTAX: BrowserProvider
          const web3Provider = new BrowserProvider(window.ethereum);
          // ETHERS V6 SYNTAX: getSigner is now async
          const signerInstance = await web3Provider.getSigner();
          const crowdfundingContract = new Contract(
            contractAddress,
            [ContractABI].abi,
            signerInstance
          );
          setContract(crowdfundingContract);
          // Listeners for account/network changes
          window.ethereum.on('accountsChanged', () => window.location.reload());
          window.ethereum.on('chainChanged', () => window.location.reload());
        } catch (error) {
          console.error("Connection error:", error);
          setNetworkError("Failed to connect to MetaMask.");
        }
      } else {
        setNetworkError("Please install MetaMask!");
      }
    }
    initEthers();
   }, []);`



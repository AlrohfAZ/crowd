// interact.js in your Hardhat project root
const { ethers } = require("hardhat"); // Import ethers from ethers.js directly for frontend-like interaction

// Adjust this path based on where your artifacts are
const crowdfundingArtifact = require('./artifacts/contracts/Crowdfunding.sol/Crowdfunding.json');
const crowdfundingABI = crowdfundingArtifact.abi;

// !!! IMPORTANT: Replace with your actual deployed contract address !!!
// This address comes from running your deploy script on Hardhat local network
const CONTRACT_ADDRESS = "0x9E545E3C0baAB3E08CdfD552C960A1050f373042";

async function main() {
  // 1. Setup Provider and Signer
    const [creatorSigner, contributorSigner] = await ethers.getSigners();
    console.log("Interacting as:", creatorSigner.address);
  // For Hardhat's local node, we can use a JsonRpcProvider
    const { JsonRpcProvider } = require("ethers");
    const provider = new JsonRpcProvider("http://127.0.0.1:8545/"); // v6 style


  // Get the first signer (account[0] in Hardhat, which is often the deployer)
  // This account will be used to send transactions.
//   const signer = provider.getSigner(0); // Gets the signer for the first account

  // 2. Instantiate the Crowdfunding Contract
  const crowdfundingContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    crowdfundingABI,
    creatorSigner
  );

  const readOnlyCrowdfundingContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    crowdfundingABI,
    provider
  );

  // Get the address of the signer (campaign creator)
  const creatorAddress = await creatorSigner.address;
  console.log(`Interacting as: ${creatorAddress}`);

  // --- Scenario: Create a Campaign ---
  console.log("\n--- Creating Campaign ---");
  const title = "Help Fund My Open Source Project";
  const description = "Developing a new blockchain tool.";
  const image = "ipfs://QmbF6t3Y...image.png"; // Placeholder
  const goal = ethers.parseEther("5"); // 5 ETH goal
  const minimumContribution = ethers.parseEther("0.1");
  const deadline = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 2800); // 7 days from now
//   const owner = creatorAddress; // This is automatically set by msg.sender in contract

//   const [signer] = await ethers.getSigners();
  
  const contractWithSigner = crowdfundingContract.connect(creatorSigner);

  const createTx = await crowdfundingContract.createCampaign(
    title,
    description,
    image,
    goal,
    minimumContribution,
    deadline
  );
  await createTx.wait();
  console.log("Campaign created successfully.");

  // Get the number of campaigns to confirm the ID (assuming it's the first one created)
  const numCampaigns = await readOnlyCrowdfundingContract.getCampaignsCount();
  const campaignId = Number(numCampaigns) - 1; // Assuming 0-indexed campaigns
  console.log(`Created campaign with ID: ${campaignId}`);

  // --- Scenario: Contribute to the Campaign ---
  console.log("\n--- Contributing to Campaign ---");
//   const contributionSigner = provider.getSigner(1); // Use a different account for contribution
//   const contributedAddress = await contributionSigner.address;
//   console.log(`Contributor: ${contributedAddress}`);

  // Create a contract instance for the contributor
  const contributorCrowdfundingContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    crowdfundingABI,
    contributorSigner
  );

  const contributorAddress = contributorSigner.address; 
  console.log("Contributor:", contributorAddress);  
  const contributionAmount = "1.5"; // 1.5 ETH
  console.log(`Contributor ${contributorAddress} sending ${contributionAmount} ETH to campaign ${campaignId}`);
  const contributeTx = await contributorCrowdfundingContract.contirbution(campaignId, {
    value: ethers.parseEther(contributionAmount),
  });
  await contributeTx.wait();
  console.log(`Contribution of ${contributionAmount} ETH confirmed.`);

  // Check campaign balance (assuming a getter for current balance exists in your contract)
  // For example, if you have a getCampaignDetails function:
  const campaignDetailsAfterContribution = await readOnlyCrowdfundingContract.getCampaignDetails(campaignId);
  console.log(`Campaign ${campaignId} current balance: ${ethers.formatEther(campaignDetailsAfterContribution.amountRaised)} ETH`);

  // --- Scenario: Fast-forward time to simulate campaign ending and goal met (for withdrawal) ---
  // In a real DApp, this would require contract logic or a time-based oracle.
  // For testing, Hardhat allows manipulating block timestamp.
  console.log("\n--- Simulating time travel for campaign end ---");
  await provider.send("evm_increaseTime", [60 * 60 * 24 * 2800 + 100]); // Fast-forward 7 days + buffer
  await provider.send("evm_mine"); // Mine a new block to apply time change
  console.log("Time has been advanced.");

  // --- Scenario: Creator Withdraws Funds ---
  // The creator is the original 'signer'
  console.log("\n--- Creator Withdrawing Funds ---");
  const creatorInitialBalance = await provider.getBalance(creatorAddress);
  console.log(`Creator initial balance (before withdrawal): ${ethers.formatEther(creatorInitialBalance)} ETH`);

  const withdrawTx = await crowdfundingContract.withdrawFunds(campaignId);
  await withdrawTx.wait();
  console.log(`Funds withdrawn by creator for campaign ${campaignId}.`);

  const creatorFinalBalance = await provider.getBalance(creatorAddress);
  console.log(`Creator final balance (after withdrawal): ${ethers.formatEther(creatorFinalBalance)} ETH`);
  console.log(`Balance change for creator: ${ethers.formatEther(creatorFinalBalance - creatorInitialBalance)} ETH`);

  // Check campaign balance after withdrawal (should be 0 or significantly reduced)
  const campaignDetailsAfterWithdrawal = await crowdfundingContract.getCampaignDetails(campaignId);
  console.log(`Campaign ${campaignId} current balance after withdrawal: ${ethers.formatEther(campaignDetailsAfterWithdrawal.amountRaised)} ETH`);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
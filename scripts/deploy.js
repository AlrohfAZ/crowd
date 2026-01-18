// deploy.js in your Hardhat project root
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
  const crowdfunding = await Crowdfunding.deploy();
  await crowdfunding.waitForDeployment();

  console.log("Crowdfunding contract deployed to:", crowdfunding.target);

  // Store this address for your frontend or interaction scripts
  // Example: fs.writeFileSync('contractAddress.json', JSON.stringify({ address: crowdfunding.address }));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  // CONTRACT ADDRESS: 0x9E545E3C0baAB3E08CdfD552C960A1050f373042
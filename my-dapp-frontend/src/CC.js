// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CrowdfundingArtifact from './contracts/Crowdfunding.json'; // The contract ABI
import './App.css'; // Basic CSS for styling
import CreateCampaign from './components/CreateCampaign'; // Import the new component


// Replace with the actual deployed address of your contract
// You can get this from your Hardhat deployment script output
const contractAddress = "0x9E545E3C0baAB3E08CdfD552C960A1050f373042";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [campaigns, setCampaigns] = useState([]); // State to store campaigns
  const fetchCampaigns = async () => {
    if (!contract) return;
    try {
      // Assuming your contract has a getCampaigns function
      // This function would typically return an array of campaign IDs or structs
      // For simplicity, let's assume it returns an array of campaign structs
      const allCampaigns = await contract.getCampaigns();
      setCampaigns(allCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    // This effect runs whenever 'contract' or 'account' changes
    if (contract) {
      // Listen for CampaignCreated event
      contract.on('CampaignCreated', (campaignId, creator, goal, deadline) => {
        console.log(`Campaign Created! ID: ${campaignId}, Creator: ${creator}, Goal: ${ethers.utils.formatEther(goal)} ETH`);
        // Re-fetch campaigns to update the list
        fetchCampaigns();
      });
      // Listen for ContributionReceived event
      contract.on('ContributionReceived', (campaignId, contributor, amount) => {
        console.log(`Contribution to Campaign ${campaignId}: ${ethers.utils.formatEther(amount)} ETH from ${contributor}`);
        // Re-fetch campaigns to update the list, or update a specific campaign's amount raised
        fetchCampaigns();
      });
      // Listen for FundsWithdrawn event
      contract.on('FundsWithdrawn', (campaignId, beneficiary, amount) => {
        console.log(`Funds Withdrawn from Campaign ${campaignId}: ${ethers.utils.formatEther(amount)} ETH by ${beneficiary}`);
        fetchCampaigns();
      });
      // Clean up event listeners when the component unmounts or contract changes
      return () => {
        contract.off('CampaignCreated');
        contract.off('ContributionReceived');
        contract.off('FundsWithdrawn');
      };
    }
  }, [contract, fetchCampaigns]); // Depend on contract and fetchCampaigns

  useEffect(() => {
    async function initEthers() {
      // Check if MetaMask is installed
      if (window.ethereum) {
        try {
          // Request account access if needed
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);

          // Create a new ethers provider from MetaMask
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);

          // Get the signer (for sending transactions)
          const signerInstance = web3Provider.getSigner(accounts[0]);
          setSigner(signerInstance);

          // Create an instance of our smart contract
          const crowdfundingContract = new ethers.Contract(
            contractAddress,
            CrowdfundingArtifact.abi,
            signerInstance // Use signer for interactions that change state
          );
          setContract(crowdfundingContract);

          // Listen for account changes
          window.ethereum.on('accountsChanged', (newAccounts) => {
            if (newAccounts.length === 0) {
              setAccount(null);
              setSigner(null);
              setContract(null);
            } else {
              setAccount(newAccounts[0]);
              // Re-initialize signer and contract with the new account
              const newSigner = web3Provider.getSigner(newAccounts[0]);
              setSigner(newSigner);
              const newCrowdfundingContract = new ethers.Contract(
                contractAddress,
                CrowdfundingArtifact.abi,
                newSigner
              );
              setContract(newCrowdfundingContract);
            }
          });

          // Listen for network changes
          window.ethereum.on('chainChanged', (_chainId) => {
            // Reload the page or re-initialize everything to reflect the new network
            window.location.reload();
          });

        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
          setNetworkError("Please connect to MetaMask and select an account.");
        }
      } else {
        setNetworkError("MetaMask is not installed. Please install it to use this DApp.");
      }
            if (crowdfundingContract) {
              fetchCampaigns(crowdfundingContract);
            }
        } catch (error) { /* ... */ }
      } else { /* ... */ }
    }
    initEthers();
  }, []); // Run only once on component mount

  useEffect(() => {
    fetchCampaigns();
  }, [contract]); // Re-run fetchCampaigns when 'contract' object changes
  // ... if (networkError) ...
  // ... if (!account) ...

  //   }
  //   initEthers();
  // }, []);

  if (networkError) {
    return (
      <div className="App">
        <h1>Crowdfunding DApp</h1>
        <p style={{ color: 'red' }}>{networkError}</p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="App">
        <h1>Crowdfunding DApp</h1>
        <p>Connecting to wallet...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Crowdfunding DApp</h1>
      <p>Connected Account: {account}</p>
      {/* Other DApp components will go here */}
    </div>
  );

  if (networkError) { /* ... */ }
  if (!account) { /* ... */ }
  return (
    <div className="App">
      <h1>Crowdfunding DApp</h1>
      <p>Connected Account: {account}</p>
      {/* Campaign Creation */}
      {contract && <CreateCampaign contract={contract} account={account} onCampaignCreated={fetchCampaigns} />}
      {/* Display Campaigns */}
      {contract && <CampaignsList campaigns={campaigns} contract={contract} account={account} onCampaignAction={fetchCampaigns} />}
      // ...
    </div>
  );
}

export default App;

import React, { useState, useEffect, useCallback } from 'react';
import {BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
import CrowdfundingArtifact from './contracts/Crowdfunding.json';
import './App.css';
import CreateCampaign from './components/CreateCampaign';
// Assuming you have a component to list campaigns
// import CampaignsList from './components/CampaignsList'; 

const contractAddress = "0x9E545E3C0baAB3E08CdfD552C960A1050f373042";

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  // UseCallback prevents this function from triggering infinite loops in useEffect
  const fetchCampaigns = useCallback(async () => {
    if (!contract) return;
    try {
      const allCampaigns = await contract.getCampaigns();
      setCampaigns(allCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  }, [contract]);

  // Handle initialization
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
            CrowdfundingArtifact.abi,
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
  }, []);

  // Handle Event Listeners
  useEffect(() => {
    if (contract) {
      fetchCampaigns();

      // ETHERS V6 SYNTAX: Events work similarly, but utils is gone
      const onCreated = (id, creator, goal) => {
        console.log(`Created: ${id}, Goal: ${formatEther(goal)} ETH`);
        fetchCampaigns();
      };

      contract.on('CampaignCreated', onCreated);
      
      return () => {
        contract.off('CampaignCreated', onCreated);
      };
    }
  }, [contract, fetchCampaigns]);

  // --- RENDER LOGIC ---
  if (networkError) return <div className="App"><p style={{color: 'red'}}>{networkError}</p></div>;
  if (!account) return <div className="App"><p>Please connect your wallet...</p></div>;

  return (
    <div className="App">
      <h1>Crowdfunding DApp</h1>
      <p>Connected: <strong>{account}</strong></p>
      
      <hr />

      {contract && (
        <CreateCampaign 
          contract={contract} 
          account={account} 
          onCampaignCreated={fetchCampaigns} 
        />
      )}

      {/* If you have a CampaignsList component, uncomment this:
        <CampaignsList campaigns={campaigns} contract={contract} /> 
      */}
    </div>
  );
}

export default App;
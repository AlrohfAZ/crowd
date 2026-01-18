// frontend/src/components/CreateCampaign.js
import React, { useState } from 'react';
import {BrowserProvider, Contract, parseEther, formatEther } from 'ethers';

function CreateCampaign({ contract, account }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState(''); // Goal in Ether
  const [deadline, setDeadline] = useState(''); // Unix timestamp
  const [campaignStatus, setCampaignStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCampaignStatus('Creating campaign...');

    if (!contract) {
      setCampaignStatus('Error: Contract not loaded.');
      return;
    }

    try {
      // Convert goal to Wei
      const goalInWei = parseEther(goal);

      // Convert deadline to Unix timestamp (seconds since epoch)
      // Assuming deadline is input as a standard date string
      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) {
        setCampaignStatus('Error: Invalid deadline date.');
        return;
      }
      const deadlineUnix = Math.floor(deadlineDate.getTime() / 1000); // in seconds

      // Call the createCampaign function on the smart contract
      const tx = await contract.createCampaign(
        title,
        description,
        goalInWei,
        deadlineUnix
      );

      setCampaignStatus(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
      await tx.wait(); // Wait for the transaction to be mined
      setCampaignStatus('Campaign created successfully!');

      // Clear form fields
      setTitle('');
      setDescription('');
      setGoal('');
      setDeadline('');

    } catch (error) {
      console.error("Error creating campaign:", error);
      setCampaignStatus(`Error creating campaign: ${error.message}`);
    }
  };

  return (
    <div className="create-campaign">
      <h2>Create New Campaign</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>Goal (ETH):</label>
          <input
            type="number"
            step="0.01"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Deadline:</label>
          <input
            type="date" // HTML5 date input type
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Campaign</button>
      </form>
      {campaignStatus && <p>{campaignStatus}</p>}
    </div>
  );
}

export default CreateCampaign;
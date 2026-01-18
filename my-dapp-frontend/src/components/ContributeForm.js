// frontend/src/components/ContributeForm.js
import React, { useState } from 'react';
import {BrowserProvider, Contract, parseEther, formatEther } from 'ethers';

function ContributeForm({ contract, campaignId, onContributionSuccess }) {
  const [amount, setAmount] = useState(''); // Amount in Ether
  const [status, setStatus] = useState('');

  const handleContribute = async (e) => {
    e.preventDefault();
    setStatus('Sending contribution...');

    if (!contract) {
      setStatus('Error: Contract not loaded.');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setStatus('Error: Contribution amount must be greater than zero.');
      return;
    }

    try {
      const amountInWei = parseEther(amount);

      // Call the contribute function on the smart contract
      const tx = await contract.contribute(campaignId, {
        value: amountInWei, // This is how you send Ether with a function call
      });

      setStatus(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
      await tx.wait();
      setStatus('Contribution successful!');
      setAmount(''); // Clear form field
      onContributionSuccess(); // Notify parent to refresh campaign data

    } catch (error) {
      console.error("Error contributing:", error);
      setStatus(`Error contributing: ${error.message}`);
    }
  };

  return (
    <div className="contribute-form">
      <h3>Contribute to Campaign #{campaignId}</h3>
      <form onSubmit={handleContribute}>
        <input
          type="number"
          step="0.001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (ETH)"
          required
        />
        <button type="submit">Contribute</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

export default ContributeForm;
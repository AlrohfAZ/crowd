// frontend/src/components/WithdrawForm.js
import React, { useState } from 'react';

function WithdrawForm({ contract, campaignId, campaignCreator, currentAccount, onWithdrawSuccess }) {
  const [status, setStatus] = useState('');

  // Only show the withdraw button if the current account is the campaign creator
  const canWithdraw = currentAccount && campaignCreator &&
                      currentAccount.toLowerCase() === campaignCreator.toLowerCase();

  const handleWithdraw = async () => {
    setStatus('Initiating withdrawal...');

    if (!contract) {
      setStatus('Error: Contract not loaded.');
      return;
    }

    try {
      // Call the withdraw function on the smart contract
      const tx = await contract.withdraw(campaignId);

      setStatus(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
      await tx.wait();
      setStatus('Withdrawal successful!');
      onWithdrawSuccess(); // Notify parent to refresh campaign data

    } catch (error) {
      console.error("Error withdrawing:", error);
      setStatus(`Error withdrawing: ${error.message}`);
    }
  };

  if (!canWithdraw) {
    return null; // Don't render if current user is not the creator
  }

  return (
    <div className="withdraw-form">
      <button onClick={handleWithdraw}>Withdraw Funds</button>
      {status && <p>{status}</p>}
    </div>
  );
}

export default WithdrawForm;
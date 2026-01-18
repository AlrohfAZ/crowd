// frontend/src/components/CampaignsList.js
import React from 'react';
import {BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
import ContributeForm from './ContributeForm'; // Import the contribution form
import WithdrawForm from './WithdrawForm';

function CampaignsList({ campaigns }) {
  if (campaigns.length === 0) {
    return (
      <div className="campaigns-list">
        <h2>No Campaigns Found</h2>
        <p>Be the first to create one!</p>
      </div>
    );
  }

   return (
    <div className="campaigns-list">
      <h2>All Campaigns</h2>
      <div className="campaigns-grid">
        {campaigns.map((campaign, index) => (
          <div key={index} className="campaign-card">
            <h3>{campaign.title}</h3>
            {/* ... other campaign details ... */}
            <p>ID: {index}</p>
            <p>Creator: {campaign.creator}</p> {/* Display creator */}
            {/* ... */}
            <ContributeForm
              contract={contract}
              campaignId={index}
              onContributionSuccess={onCampaignAction}
            />
            <WithdrawForm
              contract={contract}
              campaignId={index}
              campaignCreator={campaign.creator} // Pass the creator address
              currentAccount={account} // Pass the currently connected account
              onWithdrawSuccess={onCampaignAction}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CampaignsList;
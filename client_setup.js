// client_setup.js
const Web3 = require('web3');
const { ethers } = require('ethers'); // For ethers v5

const INFURA_PROJECT_ID = 'a3c842d252c540c0b43c442e63fee423'; // <<< REPLACE THIS

// --- Web3.js setup ---
const web3 = new Web3(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);

async function runWeb3Examples() {
    try {
        console.log('--- Web3.js Examples ---');
        const blockNumberWeb3 = await web3.eth.getBlockNumber();
        console.log('Latest Block Number (Web3.js):', blockNumberWeb3);

        const gasPriceWeb3 = await web3.eth.getGasPrice();
        console.log('Current Gas Price (Web3.js - Wei):', gasPriceWeb3);
        console.log('Current Gas Price (Web3.js - Gwei):', web3.utils.fromWei(gasPriceWeb3, 'gwei'));

    } catch (error) {
        console.error('Web3.js Error:', error);
    }
}

// --- Ethers.js setup ---
const providerEthers = new ethers.providers.InfuraProvider('sepolia', INFURA_PROJECT_ID);

async function runEthersExamples() {
    try {
        console.log('\n--- Ethers.js Examples ---');
        const blockNumberEthers = await providerEthers.getBlockNumber();
        console.log('Latest Block Number (Ethers.js):', blockNumberEthers);

        const gasPriceEthers = await providerEthers.getGasPrice();
        console.log('Current Gas Price (Ethers.js - Wei):', gasPriceEthers.toString());
        console.log('Current Gas Price (Ethers.js - Gwei):', ethers.utils.formatUnits(gasPriceEthers, 'gwei'));

    } catch (error) {
        console.error('Ethers.js Error:', error);
    }
}

// Execute the functions
runWeb3Examples();
runEthersExamples();
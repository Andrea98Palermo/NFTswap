import { createAlchemyWeb3 } from "@alch/alchemy-web3";

require("dotenv").config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const web3 = createAlchemyWeb3(alchemyKey);

// const contractABI = require('../contracts/contract-abi.json')
// const contractAddress = "0xAA";

/*
export const callContract = async () => {

    //load smart contract
    window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();

    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress).encodeABI() //make call to NFT smart contract
    };

    //sign transaction via Metamask
    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}
*/

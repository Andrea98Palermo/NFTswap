import { ethers } from "ethers";
import contract from "../contracts/contract-abi.json";

const contractAddress = "0x283a4E2CAa10C1a45095777F263C2BC8b252Bfda";
const contractABI = contract.abi;

export const callContract = async () => {
  try {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const myContract = new ethers.Contract(contractAddress, contractABI, signer);
    const message = await myContract.message();
    return message;
  } catch (error) {
    return 0;
  }
};

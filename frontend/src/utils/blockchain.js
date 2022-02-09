import { ethers } from "ethers"
import contract from "../contracts/contract-abi.json"
require("dotenv").config()

const { CONTRACT_ADDRESS } = process.env

const contractAddress = CONTRACT_ADDRESS
const contractABI = contract.abi

export const callContract = async () => {
  try {
    const { ethereum } = window
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const myContract = new ethers.Contract(contractAddress, contractABI, signer)
    const message = await myContract.message()
    return message
  } catch (error) {
    return 0
  }
}

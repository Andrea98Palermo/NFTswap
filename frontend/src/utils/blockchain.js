import { ethers } from "ethers"
import contract from "../contracts/contract-abi.json"

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

const contractAddress = CONTRACT_ADDRESS
const contractABI = contract.abi

export const callMakeProposal = async (nftAddress = "", tokenId = 0) => {
  try {
    const { ethereum } = window

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const myContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      )
      await myContract.makeProposal(nftAddress, tokenId)
      return 0
    } else {
      console.log("Ethereum object doesn't exist!")
      return "Error in Contract call"
    }
  } catch (error) {
    if (error.code === 4001) {
      console.error("Error: You need to unlock MetaMask")
      throw error
    }
    throw error
  }
}

// TODO: Test the usage of this function
export const callmakeBid = async (proposalId, bidNftAddress, bidNftTokenId) => {
  try {
    const { ethereum } = window

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const myContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      )
      const caller_address = await signer.getAddress()
      await myContract.makeBid(
        caller_address,
        proposalId,
        bidNftAddress,
        bidNftTokenId
      )
      return 0
    } else {
      console.log("Ethereum object doesn't exist!")
      return "Error in Contract call"
    }
  } catch (error) {
    console.log(error)
  }
}

export const callGetProposalsCount = async () => {
  try {
    const { ethereum } = window
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const myContract = new ethers.Contract(contractAddress, contractABI, signer)
    const caller_address = await signer.getAddress()
    const proposalsCount = await myContract.proposalsCount(caller_address)
    return proposalsCount
  } catch (err) {
    console.log("Ethereum object doesn't exist!")
    return "Error in Contract call"
  }
}

export const callGetProposals = async (index = 0) => {
  try {
    const { ethereum } = window

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const myContract = new ethers.Contract(contractAddress, contractABI, signer)
      const caller_address = await signer.getAddress()
      var proposals = []
      for (var i = 0; i < index; i++) {
        var p = await myContract.proposals(caller_address, i)
        proposals.push(p)
      }
      return proposals
    } else {
      console.log("Ethereum object doesn't exist!")
      return "Error in Contract call"
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

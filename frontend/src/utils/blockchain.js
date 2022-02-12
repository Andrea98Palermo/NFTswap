import { ethers } from "ethers"
import contract from "../contracts/contract-abi.json"

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

const contractAddress = CONTRACT_ADDRESS
const contractABI = contract.abi

export const callHelloWorld = async () => {
  try {
    const { ethereum } = window

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const myContract = new ethers.Contract(contractAddress, contractABI, signer)
      let message = await myContract.helloWorld()
      return message
    } else {
      console.log("Ethereum object doesn't exist!")
      return "Error in Contract call"
    }
  } catch (error) {
    console.log(error)
  }
}

// TODO: Test the usage of this function
export const callProposeSwap = async (nftAddress, tokenId) => {
  try {
    const { ethereum } = window

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const myContract = new ethers.Contract(contractAddress, contractABI, signer)
      await myContract.proposeSwap(nftAddress, tokenId)
      return 0
    } else {
      console.log("Ethereum object doesn't exist!")
      return "Error in Contract call"
    }
  } catch (error) {
    console.log(error)
  }
}

// TODO: Test the usage of this function
export const callmakeBid = async (proposalId, bidNftAddress, bidNftTokenId) => {
  try {
    const { ethereum } = window

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const myContract = new ethers.Contract(contractAddress, contractABI, signer)
      const caller_address = await signer.getAddress()
      await myContract.makeBid(caller_address, proposalId, bidNftAddress, bidNftTokenId)
      return 0
    } else {
      console.log("Ethereum object doesn't exist!")
      return "Error in Contract call"
    }
  } catch (error) {
    console.log(error)
  }
}

// TODO: Test the usage of this function
export const callGetProposals = async (index = 0) => {
  try {
    const { ethereum } = window

    if (ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const myContract = new ethers.Contract(contractAddress, contractABI, signer)
        const caller_address = await signer.getAddress()
        const proposals = await myContract.proposals(caller_address, index)
        console.log(proposals)
        return proposals
      } catch (e) {
        // Send error to Error reporting service in 
        // production/staging stage or log to console in dev.
        console.error(e)
        return null
      }
    } else {
      console.log("Ethereum object doesn't exist!")
      return "Error in Contract call"
    }
  } catch (error) {
    console.log(error)
  }
}

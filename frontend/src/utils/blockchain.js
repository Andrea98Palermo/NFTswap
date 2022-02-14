import { ethers } from "ethers"
import contract from "../contracts/contract-abi.json"

const CONTRACT_ADDRESS = "0xe6a664bD49Fa3bDC99090257f73f70e341a812F0"

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

export const callGetProposalsCount = async () => {
  try {
    const { ethereum } = window
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const myContract = new ethers.Contract(contractAddress, contractABI, signer)
    const caller_address = await signer.getAddress()
    const proposalsCount = await myContract.proposalsCount(caller_address)
    console.log(proposalsCount)
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
      try {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const myContract = new ethers.Contract(contractAddress, contractABI, signer)
        const caller_address = await signer.getAddress()
        var proposals = new Array(index)
        for (var i = 0; i < index; i++) {
          var p = await myContract.proposals(caller_address, i)
          proposals.push(p)
        }
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

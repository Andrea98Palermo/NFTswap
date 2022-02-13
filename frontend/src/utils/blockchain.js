import { ethers } from "ethers"
import contract from "../contracts/contract-abi.json"

// Address on Mumbai Testnet
const CONTRACT_ADDRESS = "0x48Cb4d189811fE23BFcE8e4f042f7008d0145D75"

const contractAddress = CONTRACT_ADDRESS
const contractABI = contract.abi

export const callHelloWorld = async () => {
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

export const callProposeSwap = async (nftAddress = "", tokenId = 0) => {
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
      await myContract.proposeSwap(nftAddress, tokenId)
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

export const callGetProposals = async (index = 0) => {
  try {
    const { ethereum } = window

    if (ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const myContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )
        const caller_address = await signer.getAddress()
        const proposals = await myContract.proposals(caller_address, index)
        return proposals
      } catch (error) {
        console.error(error)
        throw error
      }
    } else {
      console.log("Ethereum object doesn't exist!")
      return "Error in Contract call"
    }
  } catch (error) {
    console.log(error)
  }
}

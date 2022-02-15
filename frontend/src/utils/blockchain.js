import { ethers } from "ethers"
import contract from "../contracts/contract-abi.json"

// Mumbai testnet
const CONTRACT_ADDRESS = "0x3a8b0D1E4051f57f68C177487796996A23893921"

const contractAddress = CONTRACT_ADDRESS
const contractABI = contract.abi

const initContractCall = async () => {
  try {
    const { ethereum } = window

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      if (window.location.href.includes("vercel")) {
        const { chainId } = await provider.getNetwork()
        if (chainId != "80001") {
          alert("Please switch to the Polygon Mumbai Testnet")
          // TODO: Stop the actual call to the contract
          return
        }
      }
      const signer = provider.getSigner()
      const caller_address = await signer.getAddress()
      const myContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      )
      return { provider, signer, caller_address, myContract }
    } else {
      console.error("Ethereum object doesn't exist!")
    }
  } catch (error) {
    if (error.code === 4001) {
      console.error("Error: You need to unlock MetaMask")
      throw error
    }
    throw error
  }
}

export const callMakeProposal = async (nftAddress = "", tokenId = 0) => {
  try {
    const { myContract } = await initContractCall()
    await myContract.makeProposal(nftAddress, tokenId)
  } catch (error) {
    console.error(error)
    throw error
  }
}

// TODO: Test the usage of this function
// TODO: Add parameters "type" to the function
export const callMakeBid = async (proposalId, bidNftAddress, bidNftTokenId) => {
  try {
    const { myContract, caller_address } = initContractCall()
    await myContract.makeBid(
      caller_address,
      proposalId,
      bidNftAddress,
      bidNftTokenId
    )
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const callGetProposalsCount = async () => {
  try {
    const { myContract } = await initContractCall()
    const proposalsCount = await myContract.proposalsCount()
    return proposalsCount
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const callGetAllProposals = async (index = 0) => {
  try {
    const { myContract } = await initContractCall()
    var proposals = []
    for (var i = 0; i < index; i++) {
      var p = await myContract.proposals(i)
      proposals.push(p)
    }
    return proposals
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const callGetProposals = async (index = 0) => {
  try {
    const { myContract, caller_address } = await initContractCall()
    var proposals = []
    for (var i = 0; i < index; i++) {
      var p = await myContract.proposals(i)
      proposals.push(p)
    }
    const result = proposals.filter(p => p.proposer === caller_address)
    // TODO: Render the proposals to the UI
    return result
  } catch (error) {
    console.error(error)
    throw error
  }
}

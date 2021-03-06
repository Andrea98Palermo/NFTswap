import { ethers, BigNumber } from "ethers"
import contract from "../contracts/contract-abi.json"
import nftContract from "../contracts/erc721-abi.json"

const CONTRACT_ADDRESS = "0x2c70A9352042A54A6B54936392554B115ECa8316"

const contractAddress = CONTRACT_ADDRESS
const contractABI = contract.abi
const nftABI = nftContract.abi

const initContractCall = async () => {
  try {
    const { ethereum } = window

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      if (window.location.href.includes("vercel")) {
        const { chainId } = await provider.getNetwork()
        if (chainId != "4") {
          alert("Please switch to the Ethereum Rinkeby Testnet")
          throw Error("Please switch to the Ethereum Rinkeby Testnet")
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
    const result = await myContract.makeProposal(nftAddress, tokenId)
    const receipt = await result.wait()
    return receipt
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const callMakeBid = async (
  proposal = "",
  bidNftAddress = "",
  bidNftToken = ""
) => {
  try {
    const { myContract } = await initContractCall()
    const proposalId = BigNumber.from(proposal)
    const bidNftTokenId = BigNumber.from(bidNftToken)
    const result = await myContract.makeBid(proposalId, bidNftAddress, bidNftTokenId)
    const receipt = await result.wait()
    return receipt
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
    for (var i = 1; i < index; i++) {
      var p = await myContract.proposals(i)
      proposals.push(p)
    }
    return proposals
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const callGetMyProposals = async (index = 0) => {
  try {
    const { myContract, caller_address } = await initContractCall()
    let allProposals = []
    for (let i = 1; i < index + 1; i++) {
      let p = await myContract.proposals(i)
      allProposals.push(p)
    }
    const result = allProposals.filter((p) => p.proposer === caller_address)
    return result
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const callApprove = async (nftContractAddress = "", tokenId = "") => {
  try {
    const { ethereum } = window
    const provider = new ethers.providers.Web3Provider(ethereum)
    const nftTokenId = BigNumber.from(tokenId)
    const signer = provider.getSigner()
    const nftContract = new ethers.Contract(nftContractAddress, nftABI, signer)
    const result = await nftContract.approve(CONTRACT_ADDRESS, nftTokenId)
    const receipt = await result.wait()
    return receipt
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const callGetApproved = async (
  nftContractAddress = "",
  tokenId = ""
) => {
  try {
    const { ethereum } = window
    const provider = new ethers.providers.Web3Provider(ethereum)
    const nftTokenId = BigNumber.from(tokenId.trim())
    const signer = provider.getSigner()
    const nftContract = new ethers.Contract(nftContractAddress, nftABI, signer)
    const result = await nftContract.getApproved(nftTokenId)
    return result === CONTRACT_ADDRESS
  } catch (error) {
    return false
  }
}

export const callBidsCount = async () => {
  try {
    const { myContract } = await initContractCall()
    const bidsCount = myContract.bidsCount()
    return bidsCount
  } catch (err) {
    console.error(err)
    throw err
  }
}

// TODO: Test it
export const callGetBidFromProposal = async (proposalId = 0, index = 0) => {
  try {
    const { myContract } = await initContractCall()
    const bidsCount = await callBidsCount()
    let bids = []
    for (let i = 0; i < bidsCount; i++) {
      let b = await myContract.bidsCount(proposalId, index)
      bids.push(b)
    }
    return bids
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const callGetBidsFromProposal = async (proposalId = 0) => {
  try {
    const { myContract } = await initContractCall()
    const bids = await myContract.getBidsFromProposal(proposalId)
    return bids
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const callBids = async (bidId = 0) => {
  try {
    const { myContract } = await initContractCall()
    let bid = await myContract.bids(bidId)
    return bid
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const callAcceptBid = async (proposalId = "", bidId = "") => {
  try {
    const { myContract } = await initContractCall()
    const proposalIdNum = BigNumber.from(proposalId)
    const bidIdNum = BigNumber.from(bidId)
    let bid = await myContract.acceptBid(proposalIdNum, bidIdNum)
    const receipt = await bid.wait()
    return receipt
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const callRefuseBid = async (proposalId = "", bidId = "") => {
  try {
    const { myContract } = await initContractCall()
    const proposalIdNum = BigNumber.from(proposalId)
    const bidIdNum = BigNumber.from(bidId)
    let bid = await myContract.refuseBid(proposalIdNum, bidIdNum)
    const receipt = await bid.wait()
    return receipt
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const callGetMyBids = async (index = 0) => {
  try {
    const { myContract, caller_address } = await initContractCall()
    let allBids = []
    for (let i = 1; i < index + 1; i++) {
      let p = await myContract.bids(i)
      allBids.push(p)
    }
    const result = allBids.filter((p) => p.bidder === caller_address)
    return result
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const callDeleteBid = async (bidId = "") => {
  try {
    const { myContract } = await initContractCall()
    const bidIdNum = BigNumber.from(bidId)
    const bid = await myContract.deleteBid(bidIdNum)
    const receipt = await bid.wait()
    return receipt
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const callDeleteProposal = async (proposalId = "") => {
  try {
    const { myContract } = await initContractCall()
    const proposalIdNum = BigNumber.from(proposalId)
    const prop = await myContract.deleteProposal(proposalIdNum)
    const receipt = await prop.wait()
    return receipt
  } catch (err) {
    console.log(err)
    throw err
  }
}


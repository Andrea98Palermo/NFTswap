import { ethers, BigNumber } from "ethers"
import contract from "../contracts/contract-abi.json"

const CONTRACT_ADDRESS = "0xe777D31b07aC1c48CBaB1d4ed4d88D74B595Af6F"

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
          throw Error("Please switch to the Polygon Mumbai Testnet")
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
export const callMakeBid = async (proposal = "", bidNftAddress = "", bidNftToken= "") => {
  try {
    const { myContract } = await initContractCall()
    const proposalId = BigNumber.from(proposal)
    const bidNftTokenId = BigNumber.from(bidNftToken)
    await myContract.makeBid(
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
    let allProposals = []
    for (let i = 0; i < index; i++) {
      let p = await myContract.proposals(i)
      allProposals.push(p)
    }
    let proposals = []
    allProposals.map((token) => {
      if (token.proposer == caller_address) {
        proposals.push(token)
      }
    })
    console.log(proposals)
    return proposals
  } catch (error) {
    console.error(error)
    throw error
  }
}

// TODO: Test it
export const callBidsCount = async () => {
  try {
    const { myContract } = await initContractCall()
    const bidsCount = myContract.bidsCount()
    return bidsCount
  } catch (err) {
    console.log(err)
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
    console.log(bids)
    return bids
  } catch (err) {
    console.log(err)
    throw err
  }
}

// TODO: Test it
export const callGetBidsFromProposal = async (proposalId = 0) => {
  try {
    const { myContract } = await initContractCall()
    let bids = await myContract.getBidsFromProposal(proposalId)
    console.log(bids)
    return bids
  } catch (err) {
    console.log(err)
    throw err
  }
}
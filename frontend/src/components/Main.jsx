import Spacer from "./Spacer"
import Card from "./Card"
import { useWeb3React } from "@web3-react/core"
import { callGetProposals, callGetProposalsCount } from "../utils/blockchain"
import { useState, useEffect } from "react"
// import { BigNumber } from "ethers"
import axios from "axios"

//onst defaultProposal = {
//  nftAddress: "",
//  tokenId: BigNumber.from(0),
//  proposalId: 0,
//}

const apiKey = process.env.REACT_APP_ALCHEMY_API_KEY || "demo"
const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}/getNFTMetadata`

const client = axios.create({
  baseURL: baseURL,
})

function Main() {
  const { account, active } = useWeb3React()
  //const [proposals, setProposals] = useState(defaultProposal)
  const [nft, setNft] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(async () => {
    if (active) {
      try {
        const proposalsCount = await callGetProposalsCount()
        const proposals = await callGetProposals(proposalsCount)
        const result = proposals.filter(
          (proposal) =>
            proposal.proposer !== "0x0000000000000000000000000000000000000000"
        )
        let localNFT = []
        for (let proposal of result) {
          localNFT.push([proposal.nftAddress, proposal.tokenId.toString()])
        }
        let promises = []
        let globalNFT = []
        for (let nft of localNFT) {
          promises.push(
            client
              .get(`?contractAddress=${nft[0]}&tokenId=${nft[1]}`)
              // TODO: Check if there is (spoiler: there is) a better way to async add to the `nft` state
              // and async render also the `Card` component
              // Up to now the requests are mode in parallel, but we wait for all of them to finish to set the `nft` state
              // and render the `Card` component
              .then((response) => {
                globalNFT.push(response.data)
              })
          )
        }
        Promise.all(promises).then(() => setNft(globalNFT), setLoading(false))
      } catch (err) {
        setLoading(false)
        console.log(err)
      }
    }
  }, [account])

  /*
  const onButtonPressed = async () => {
    try {
      const proposal = await callGetProposals(0)
      setProposals(proposal)
    } catch (error) {
      console.error(error)
    }
  }
  */

  if (!window.ethereum) {
    return (
      <div className="container mx-auto">
        <h2 className="text-xl font-bold basis-full justify-center">
          Install MetaMask
        </h2>
      </div>
    )
  }

  if (!active) {
    return (
      <div className="container mx-auto">
        <h2 className="text-xl font-bold basis-full justify-center">
          Connect a Wallet
        </h2>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-xl font-bold basis-full justify-center">Home Page</h2>
      <Spacer space={32} />
      <div className="flex flex-wrap justify-center items-start">
        {!loading ? (
          nft.length > 0 ? (
            nft.map((asset, index) => {
              return (
                <button key={index}>
                  <Card
                    title={asset.title}
                    description={asset.description}
                    image={asset.metadata.image}
                  />
                </button>
              )
            })
          ) : (
            <p>No proposals in the contract</p>
          )
        ) : (
          <>
            <p>Retrieving proposals</p>
          </>
        )}
      </div>
    </div>
  )
}

export default Main

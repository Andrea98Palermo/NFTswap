import { useState, useEffect, useCallback } from "react"
import { callGetProposalsCount, callGetProposals, callGetBidsFromProposal } from "../utils/blockchain"
import { useWeb3React } from "@web3-react/core"
import axios from "axios"
import Spacer from "./Spacer"
import Card from "./Card"

const client = axios.create({
  baseURL: "https://api.opensea.io/api/v1/",
})

export default function Proposals() {
  const [nft, setNft] = useState(null)
  //const [bids, setBids] = useState(null)
  const [setShowModal] = useState(false)
  const [setAsset] = useState(null)
  const [setError] = useState("")
  const { account, active } = useWeb3React()

  useEffect(async () => {
    if (active) {
      try {
        // Get proposals
        const proposalsCount = parseInt(await callGetProposalsCount(), 16)
        const proposals = await callGetProposals(proposalsCount)
        let tokenIds = []
        // have to change probably, because proposalsCount should be the number of ALL proposals in the contract
        for (let i = 0; i < proposalsCount - 1; i++) {
          tokenIds.push(parseInt(proposals[i].tokenId._hex, 16))
        }
        const response = await client.get("assets?owner=" + account)
        const tokens = response.data
        let listedProposals = []
        tokens.assets.map((token) => {
          if (tokenIds.includes(token.id)) {
            listedProposals.push(token)
          }
        })
        console.log(listedProposals)
        setNft(listedProposals)

        // Get bids relative to proposals published
        //const bidsCount = parseInt(await callBidsCount(), 16)
        let bids = {}
        for (let p in listedProposals) {
          bids[p.id] = await callGetBidsFromProposal(p.id)
        }
        console.log(bids)
        //setBids(bids)
      } catch (err) {
        console.log(err)
      }
    }
  }, [account])

  const handleCardClick = useCallback(
    (asset) => () => {
      setError("")
      setShowModal(true)
      setAsset(asset)
    },
    []
  )

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
      <h1 className="text-xl font-bold basis-full justify-center">
        Your proposals
      </h1>
      <Spacer space={32} />
      <div className="container grid gap-5 grid-cols-4">
        {!nft && <div>Loading...</div>}
        {nft && !nft.length && <div>No proposal found</div>}
        {nft && nft.length
          ? nft.map((asset, index) => {
            return (
              <button key={index} onClick={handleCardClick(asset)}>
                <Card
                  title={asset.name}
                  description={asset.description}
                  image={asset.image_url}
                  link={asset.permalink}
                />
              </button>
            )
          })
          : null}
      </div>
    </div>
  )
}
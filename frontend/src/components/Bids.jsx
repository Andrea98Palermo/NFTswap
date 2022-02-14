import { useState, useEffect } from "react"
import { callGetProposalsCount, callGetProposals } from "../utils/blockchain"
import { useWeb3React } from "@web3-react/core"
import axios from "axios"
import Spacer from "./Spacer"
import Card from "./Card"

const client = axios.create({
  baseURL: "https://api.opensea.io/api/v1/",
})

export default function Bids() {
  const [nft, setNft] = useState(null)
  const { account, active } = useWeb3React()

  useEffect(async () => {
    if (active) {
      try {
        const proposalsCount = parseInt(await callGetProposalsCount(), 16)
        const proposals = await callGetProposals(proposalsCount)
        let tokenIds = []
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
        setNft(listedProposals)
      } catch (err) {
        console.log(err)
      }
    }
  }, [account])

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
      <Spacer space={32} />
      <div className="container grid gap-5 grid-cols-4">
        {!nft && <div>Loading...</div>}
        {nft &&
          nft.length ?
          nft.map((asset, index) => {
            return (
              <Card
                key={index}
                title={asset.name}
                description={asset.description}
                image={asset.image_url}
                link={asset.permalink}
              />
            )
          }) : null}
      </div>
    </div>
  )
}
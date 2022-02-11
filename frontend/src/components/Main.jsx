import Card from "./Card"
import Spacer from "./Spacer"
import axios from "axios"
import { useState, useEffect } from "react"
import { useWeb3React } from "@web3-react/core"

const client = axios.create({
  baseURL: "https://api.opensea.io/api/v1/",
})

function Main() {
  const [nft, setNft] = useState(null)
  const { account, active} = useWeb3React()

  useEffect(async () => {
    const response = await client.get("assets?owner=" + account)
    setNft(response.data)
  }, [account])

  if (!active)  {
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
      <h2 className="text-xl font-bold basis-full justify-center">
        Latest NFTs
      </h2>
      <Spacer space={32} />
      <div className="container grid gap-5 grid-cols-4">
        {!nft && <div>Loading...</div>}
        {nft && !nft.assets.length && <div>No NFTs found</div>}
        {nft &&
          nft.assets.length &&
          nft.assets.map((asset, index) => {
            return (
              <Card
                key={index}
                title={asset.name}
                description={asset.description}
                image={asset.image_url}
                link={asset.permalink}
              />
            )
          })}
      </div>
    </div>
  )
}

export default Main

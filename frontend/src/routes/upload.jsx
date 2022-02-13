import Card from "../components/Card"
import Spacer from "../components/Spacer"
import axios from "axios"
import { useState, useEffect, useReducer } from "react"
import { useWeb3React } from "@web3-react/core"
import { callProposeSwap } from "../utils/blockchain"

const client = axios.create({
  baseURL: "https://api.opensea.io/api/v1/",
})

const initialFormData = {
  nftaddress: "",
  tokenid: "",
}

const formReducer = (state, event) => {
  if (event.reset) {
    return initialFormData
  }
  return {
    ...state,
    [event.name]: event.value,
  }
}

export default function Upload() {
  const [nft, setNft] = useState(null)
  const [formData, dispatchFormData] = useReducer(formReducer, initialFormData)
  const { account, active } = useWeb3React()

  useEffect(async () => {
    if (active) {
      try {
        const response = await client.get("assets?owner=" + account)
        setNft(response.data)
      } catch (error) {
        alert(error)
      }
    }
  }, [account])

  const handleSubmit = (event) => {
    event.preventDefault()
    callProposeSwap(formData.nftaddress, formData.tokenid)
    dispatchFormData({ reset: true })
  }

  const handleChange = (event) => {
    dispatchFormData({
      name: event.target.name,
      value: event.target.value,
    })
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
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            <p>NFT Address</p>
            <input
              name="nftaddress"
              onChange={handleChange}
              required
              value={formData.nftaddress}
            />
          </label>
          <label>
            <p>Token ID</p>
            <input
              name="tokenid"
              onChange={handleChange}
              required
              value={formData.tokenid}
            />
          </label>
        </fieldset>
        <button type="submit">Submit</button>
      </form>
      <h2 className="text-xl font-bold basis-full justify-center">Your NFTs</h2>
      <Spacer space={32} />
      <div className="container grid gap-5 grid-cols-4">
        {!nft && <div>Loading...</div>}
        {nft && !nft.assets.length && <div>No NFTs found</div>}
        {nft && nft.assets.length
          ? nft.assets.map((asset, index) => {
            return (
              <Card
                key={index}
                title={asset.name}
                description={asset.description}
                image={asset.image_url}
                link={asset.permalink}
              />
            )
          })
          : null}
      </div>
    </div>
  )
}

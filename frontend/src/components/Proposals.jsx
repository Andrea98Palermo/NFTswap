import { useState, useEffect } from "react"
import { callGetProposalsCount, callGetProposals } from "../utils/blockchain"
import { useWeb3React } from "@web3-react/core"
import Spacer from "./Spacer"
//import Card from "./Card"

export default function Proposals() {
  const [nft, setNft] = useState(null)
  const { account, active } = useWeb3React()

  useEffect(async () => {
    if (active) {
      try {
        const proposalsCount = await callGetProposalsCount()
        console.log("len " + proposalsCount)
        const proposals = await callGetProposals(proposalsCount)
        console.log(proposals)
        setNft(proposals)
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
        {nft && <p>{nft.nftAddress}</p>}
      </div>
    </div>
  )
}
import { useState, useEffect, useCallback } from "react"
import { callGetProposalsCount, callGetProposals, callGetBidsFromProposal, callBids } from "../utils/blockchain"
import { useWeb3React } from "@web3-react/core"
import axios from "axios"
import Spacer from "./Spacer"
import Card from "./Card"

const client = axios.create({
  baseURL: "https://api.opensea.io/api/v1/",
})

export default function Proposals() {
  const [nft, setNft] = useState(null)
  const [bids, setBids] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [setAsset] = useState(null)
  const [error, setError] = useState("")
  const { account, active } = useWeb3React()

  useEffect(async () => {
    if (active) {
      try {
        // Get proposals
        const proposalsCount = parseInt(await callGetProposalsCount(), 16)
        const proposals = await callGetProposals(proposalsCount)
        let tokenIds = []
        for (let i = 0; i < proposals.length; i++) {
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

        // Get bids relative to proposals published
        let proposalIds = []
        proposals.map((token) => {
          proposalIds.push(parseInt(token.proposalId._hex, 16))
        })

        let bidIds = {}
        let bidDict = {}
        let bid
        let bidderAssets
        let resp
        for (let i = 0; i < proposalIds.length; i++) {
          bidIds[proposalIds[i]] = await callGetBidsFromProposal(proposalIds[i])
          for (let b in bidIds[proposalIds[i]]) {
            bid = await callBids(parseInt(bidIds[proposalIds[i]][b]._hex, 16))
            resp = await client.get("assets?owner=" + bid.bidder)
            bidderAssets = resp.data.assets
            bidderAssets.map((token) => {
              if (bid.tokenId == token.id) {
                bidDict[proposalIds[i]] = token
              }
            })
          }
        }
        console.log(bidDict)

        setBids(bidDict)
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

  const handleCardClick = useCallback(
    (asset) => () => {
      setError("")
      setShowModal(true)
      setAsset(asset)
    },
    []
  )

  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-bold basis-full justify-center">
        Your proposals
      </h1>
      <Spacer space={32} />
      <div className="container">
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
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Bids list</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-8">
                  {bids && bids.length
                    ? bids.map((asset, index) => {
                      return (
                        <Card
                          key={index}
                          title={asset.name}
                          description={asset.description}
                          image={asset.image_url}
                          link={asset.permalink}
                        />
                      )
                    }) : (<p>No bids here!</p>)
                  }
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  {error ? (
                    <div>
                      <p>{error}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  )
}
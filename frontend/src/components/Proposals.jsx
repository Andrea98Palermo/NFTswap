import { useState, useEffect, useCallback } from "react"
import {
  callGetProposalsCount,
  callGetMyProposals,
  callGetBidsFromProposal,
  callBids,
} from "../utils/blockchain"
import { useWeb3React } from "@web3-react/core"
import Spacer from "./Spacer"
import Card from "./Card"
import { sanityclient } from "../utils/sanity"
import CardInfo from "./CardInfo"


export default function Proposals() {
  const [nft, setNft] = useState([])
  const [bids, setBids] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [asset, setAsset] = useState(null)
  const [error, setError] = useState("")
  const { account, active } = useWeb3React()

  useEffect(async () => {
    if (active) {
      try {
        // Get proposals for the connected user
        setNft([])
        const proposalsCount = parseInt(await callGetProposalsCount(), 16) - 1
        const proposals = await callGetMyProposals(proposalsCount)
        let proposalIds = []
        for (let proposal of proposals) {
          let { nftAddress, proposalId, tokenId } = proposal
          nftAddress = nftAddress.toLowerCase()
          proposalIds.push(proposal.proposalId)
          const query = `*[_type == 'nfts' && _id == "${nftAddress}-${tokenId}"][0]`
          let collectionData = await sanityclient.fetch(query)
          collectionData = {...collectionData, proposalId}
          setNft((prevState) => [...prevState, collectionData])
        }

        let bidIds = {}
        let biddedNftsData = {}
        let bid
        for (let proposalId of proposalIds) {
          // Ritorna un array di BidsRef
          bidIds[proposalId] = await callGetBidsFromProposal(proposalId)

          for (let b in bidIds[proposalId]) {
            bid = await callBids(parseInt(bidIds[proposalId][b].toString()))
            if (biddedNftsData[proposalId] === undefined) {
              biddedNftsData[proposalId] = []
              biddedNftsData[proposalId].push(bid)
            } else {
              biddedNftsData[proposalId].push(bid)
            }
          }
        }
        setBids(biddedNftsData)
      } catch (err) {
        setError(err.message)
        console.error(err)
      }
    }
  }, [account])

  const handleCardClick = useCallback(
    (asset) => async () => {
      setShowModal(true)
      setAsset(asset)
    },
    []
  )

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
                  title={asset.title}
                  description={asset.description}
                  image={asset.imageUrl}
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
                  <h3 className="text-3xl font-semibold">Bids for {asset.title}</h3>
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
                  { bids[asset.proposalId] !== undefined && 
                    bids[asset.proposalId].map((bid, index) => {
                      return (
                        <div key={index} className="flex flex-row">
                          <a href={`https://testnets.opensea.io/assets/${bid.nftAddress}/${bid.tokenId.toString()}`} target="_blank" rel="noopener noreferrer">
                            <CardInfo contractAddress={bid.nftAddress} tokenId={bid.tokenId.toString()}/>
                          </a>
                          <button className="bg-amber-500 text-white active:bg-emerald-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                            Acccept Bid
                          </button>
                          <button className="bg-amber-500 text-white active:bg-emerald-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                            Refuse Bid
                          </button>
                        </div>
                      )
                    })
                  }
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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

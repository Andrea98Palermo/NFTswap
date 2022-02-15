import Spacer from "./Spacer"
import Card from "./Card"
import CardInfo from "./CardInfo"
import { useWeb3React } from "@web3-react/core"
import {
  callGetAllProposals,
  callGetProposalsCount,
  callMakeBid,
} from "../utils/blockchain"
import { useState, useEffect, useCallback, useReducer } from "react"
import { sanityclient } from "../utils/sanity"

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

function Main() {
  const { account, active } = useWeb3React()
  //const [proposals, setProposals] = useState(defaultProposal)
  const [nft, setNft] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [asset, setAsset] = useState(null)
  const [error, setError] = useState("")
  const [formData, dispatchFormData] = useReducer(formReducer, initialFormData)
  const [proposalId, setProposalId] = useState("")

  useEffect(async () => {
    if (active) {
      try {
        const proposalsCount = await callGetProposalsCount()
        const proposals = await callGetAllProposals(proposalsCount)
        const result = proposals.filter(
          (proposal) =>
            proposal.proposer !== "0x0000000000000000000000000000000000000000"
        )
        let localNFT = []
        for (let proposal of result) {
          localNFT.push([
            proposal.nftAddress,
            proposal.tokenId.toString(),
            proposal.proposalId.toString(),
          ])
        }
        let globalNFT = []
        for (let nft of localNFT) {
          const query = `*[_type == 'nfts' && _id == "${nft[0].toLowerCase()}-${
            nft[1]
          }"][0]`
          const collectionData = await sanityclient.fetch(query)
          const result = { ...collectionData, proposalId: nft[2] }
          globalNFT.push(result)
        }
        setNft(globalNFT)
        setLoading(false)
      } catch (err) {
        setLoading(false)
        console.error(err)
      }
    }
  }, [account])

  const handleCardClick = useCallback(
    (asset) => () => {
      setProposalId(asset.proposalId)
      setError("")
      setShowModal(true)
      setAsset(asset)
    },
    []
  )

  const handleFormChange = async (event) => {
    dispatchFormData({
      name: event.target.name,
      value: event.target.value,
    })
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    await callMakeBid(proposalId, formData.nftaddress, formData.tokenid)
    dispatchFormData({ reset: true })
  }

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
                <button key={index} onClick={handleCardClick(asset)}>
                  <Card
                    title={asset.title}
                    description={asset.description}
                    image={asset.imageUrl}
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
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Make a bid</h3>
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
                    <Card
                      title={asset.title}
                      description={asset.description}
                      image={asset.metadata.image}
                    />
                    <CardInfo
                      contractAddress={asset.contract.address}
                      tokenId={asset.id.tokenId}
                      tokenType={asset.id.tokenMetadata.tokenType}
                    />
                    <form onSubmit={handleFormSubmit} className="mx-auto">
                      <div>
                        <label>
                          <p>NFT Address to propose</p>
                        </label>
                        <input
                          type="text"
                          name="nftaddress"
                          onChange={handleFormChange}
                          required
                          value={formData.nftaddress}
                        />
                      </div>
                      <div>
                        <label>
                          <p>Token ID to propose</p>
                        </label>
                        <input
                          type="text"
                          name="tokenid"
                          onChange={handleFormChange}
                          required
                          value={formData.tokenid}
                        />
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
                        <button
                          className="bg-amber-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="submit"
                        >
                          Bid
                        </button>
                        {error ? (
                          <div>
                            <p>{error}</p>
                          </div>
                        ) : null}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default Main

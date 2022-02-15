import Card from "../components/Card"
import CardInfo from "../components/CardInfo"
import Spacer from "../components/Spacer"
import axios from "axios"
import { useState, useEffect, useReducer, useCallback } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  callMakeProposal,
  callApprove,
  callGetApproved,
} from "../utils/blockchain"
import toast, { Toaster } from "react-hot-toast"

const client = axios.create({
  baseURL: "https://rinkeby-api.opensea.io/api/v1/",
})

const Ok = 0
const Error = 1

const initialFormData = {
  nftaddress: "",
  tokenid: "",
}

const notify = (status, message) => {
  switch(status){
  case Ok:
    toast.success(message)
    break
  case Error:
    toast.error(message)
    break
  }
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
  const { account, active } = useWeb3React()

  // States
  const [nft, setNft] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, dispatchFormData] = useReducer(formReducer, initialFormData)
  const [asset, setAsset] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [approved, setApproved] = useState(false)

  useEffect(async () => {
    if (active) {
      try {
        const response = await client.get("assets?owner=" + account)
        console.log(response.data)
        setNft(response.data)
      } catch (error) {
        alert(error)
      }
    }
  }, [account])

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    await callMakeProposal(formData.nftaddress, formData.tokenid)
    dispatchFormData({ reset: true })
  }

  const handleCardClick = useCallback(
    (asset) => async () => {
      setError("")
      setShowModal(true)
      setAsset(asset)
      const approvedStatus = await callGetApproved(asset.asset_contract.address, asset.token_id)
      setApproved(approvedStatus)
    },
    []
  )

  const handleCardSubmit = async (event) => {
    event.preventDefault()
    console.log(asset.asset_contract.address)
    console.log(asset.id)
    try {
      await callMakeProposal(asset.asset_contract.address, asset.id)
      setShowModal(false)
    } catch (error) {
      setLoading(false)
      notify(Error, "Error in proposal creation")
      setError(error.message)
    }
  }

  const handleCardApprove = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      await callApprove(asset.asset_contract.address, asset.token_id)
      setLoading(false)
      setApproved(true)
      notify(Ok, "NFT Approved!")
    } catch (error) {
      notify(Error, "Error in NTF approval")
      setError(error.message)
    }
  }

  const handleFormChange = async (event) => {
    dispatchFormData({
      name: event.target.name,
      value: event.target.value,
    })
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
      <h1 className="text-xl font-bold basis-full justify-center">
        Make a proposal
      </h1>
      <Spacer space={32} />
      <form onSubmit={handleFormSubmit} className="mx-auto">
        <div>
          <label>
            <p>NFT Address</p>
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
            <p>Token ID</p>
          </label>
          <input
            type="text"
            name="tokenid"
            onChange={handleFormChange}
            required
            value={formData.tokenid}
          />
        </div>
        <button
          type="submit"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Submit
        </button>
      </form>
      <h2 className="text-xl font-bold basis-full justify-center">Your NFTs</h2>
      <Spacer space={32} />
      <div className="container grid gap-5 grid-cols-4">
        {!nft && <div>Loading...</div>}
        {nft && !nft.assets.length && <div>No NFTs found</div>}
        {nft && nft.assets.length
          ? nft.assets.map((asset, index) => {
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
        <Toaster />
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Make a proposal</h3>
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
                      title={asset.name}
                      description={asset.description}
                      image={asset.image_url}
                      link={asset.permalink}
                    />
                    <CardInfo
                      contractAddress={asset.asset_contract.address}
                      tokenId={asset.token_id}
                      tokenType={asset.asset_contract.schema_name}
                    />
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

                    {!approved ? (
                      <>
                        {!loading ? (
                          <button
                            className="bg-amber-500 text-white active:bg-emerald-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={handleCardApprove}
                          >
                          Approve
                          </button>
                        ) : (
                          <button type="button" className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-amber-500 hover:bg-amber-400 transition ease-in-out duration-150 cursor-not-allowed" disabled>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        Processing...
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {!loading ? (
                          <button
                            className="bg-amber-500 text-white active:bg-emerald-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={handleCardSubmit}
                          >
                          Propose
                          </button>
                        ) : (
                          <button type="button" className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-amber-500 hover:bg-amber-400 transition ease-in-out duration-150 cursor-not-allowed" disabled>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        Processing...
                          </button>
                        )}
                      </>
                    )}
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
    </div>
  )
}

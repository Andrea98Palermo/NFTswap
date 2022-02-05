import { useEffect, useState } from "react"
import { connectWallet, getCurrentWalletConnected } from "../utils/wallet"
import { callContract } from "../utils/blockchain"

function Main() {
  // State variables
  const [walletAddress, setWallet] = useState("")
  const [status, setStatus] = useState("")
  const [message, setMessage] = useState("No message")
  const [title] = useState("🎨 NFT Swap")

  async function addWalletListener() {
    const { ethereum } = window
    if (ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0])
          setStatus(`👋 Hi${accounts[0]}`)
        } else {
          setWallet("")
          setStatus("🦊 Connect to Metamask using the top right button.")
        }
      })
    } else {
      setStatus(
        <p>
          {" "}
          🦊
          {" "}
          <a target="_blank" rel="noopener noreferrer" href="https://metamask.io/download.html">
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      )
    }
  }

  useEffect(() => {
    (async () => {
      addWalletListener()
      const { address, status } = await getCurrentWalletConnected()
      setWallet(address)
      setStatus(status)
    })()
  }, [])

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet()
    setStatus(walletResponse.status)
    setWallet(walletResponse.address)
  }

  const onButtonPressed = async () => {
    const message = await callContract()
    setMessage(message)
  }

  return (
    <div className="Main">
      <button id="walletButton" onClick={connectWalletPressed} type="button">
        {walletAddress.length > 0
          ? (
            `Connected: ${String(walletAddress).substring(0, 6)
            }...${String(walletAddress).substring(38)}`
          )
          : (
            <span>Connect Wallet</span>
          )}
      </button>

      <br />
      <h1 id="title">{title}</h1>
      <div>
        <p id="status">{status}</p>
      </div>
      {walletAddress.length > 0
        ? (
          <>
            <button id="callButton" onClick={onButtonPressed} type="button">
              Call Contract
            </button>
            <div>
              <p id="status">Message: {message}</p>
            </div>
          </>
        )
        : <p />}
    </div>
  )
}

export default Main

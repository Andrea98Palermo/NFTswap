import Spacer from "./Spacer"
import { useWeb3React } from "@web3-react/core"
import { callGetProposals } from "../utils/blockchain"
import { useState } from "react"
import { BigNumber } from "ethers"

const defaultProposal = {
  nftAddress: "",
  tokenId: BigNumber.from(0),
  proposalId: 0,
}

function Main() {
  const { active } = useWeb3React()
  const [proposals, setProposals] = useState(defaultProposal)

  const onButtonPressed = async () => {
    try {
      const proposal = await callGetProposals(0)
      setProposals(proposal)
    } catch (error) {
      console.error(error)
    }
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
      {active ? (
        <>
          <button
            id="callButton"
            onClick={onButtonPressed}
            type="button"
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Call Contract
          </button>
          <div>
            <p>NFT Address: {proposals.nftAddress}</p>
            <p>Token ID: {proposals.tokenId._hex}</p>
            <p>Proposal ID: {proposals.proposalId}</p>
          </div>
        </>
      ) : (
        <p />
      )}
    </div>
  )
}

export default Main

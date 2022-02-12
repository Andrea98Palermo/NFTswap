import Spacer from "./Spacer"
import { useWeb3React } from "@web3-react/core"


function Main() {
  const { active} = useWeb3React()

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
        Home Page
      </h2>
      <Spacer space={32} />
    </div>
  )
}

export default Main

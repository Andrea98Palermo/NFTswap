import { NavLink } from "react-router-dom"
import { injected } from "../utils/connector"
import { useWeb3React } from "@web3-react/core"
import {  useEffect } from "react"

const navigation = [
  { name: "Marketplace", href: "/" },
  { name: "Upload", href: "/upload" },
  { name: "Profile", href: "/profile" },
]
let activeStyle = {
  textDecoration: "underline",
}

export default function Navbar() {
  const { active, account, activate, deactivate } = useWeb3React()

  async function connect() {
    try {
      await activate(injected)
    } catch (error) {
      console.error(error)
    }
  }

  async function disconnect() {
    try {
      await deactivate()
    } catch (error) {
      console.error(error)
    }
  }

  // TODO: Check if account is still active
  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected)
      }
    })
  }, [activate]) 
  

  return (
    <nav className="bg-lime-400 border-b-2 border-b-black shadow-xl">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="basis-1 flex items-center justify-start sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-mono text-3xl font-medium">
                NFTswap
              </span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-center">
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className="font-mono"
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {!active && (
              <button
                onClick={connect}
                type="button"
                className="bg-amber-500 p-2.5 rounded-lg hover:shadow-lg text-black shadow hover:shadow-lg font-mono"
              >
                <span>Connect wallet</span>
              </button>
            )}
            {active && (
              <button 
                type="button"
                onClick={disconnect}
                className="bg-amber-500 p-2.5 rounded-lg hover:shadow-lg text-black shadow hover:shadow-lg font-mono">
                👋 {account.substring(0, 4)}...{account.substring(39)}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

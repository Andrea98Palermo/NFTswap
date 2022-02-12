import {  MenuIcon, XIcon } from "@heroicons/react/outline"
import { NavLink } from "react-router-dom"
import { injected } from "../utils/connector"
import { useWeb3React } from "@web3-react/core"

const navigation = [
  { name: "Marketplace", href: "/" },
  { name: "Upload", href: "/upload" },
  { name: "Profile", href: "/profile" },
]
let activeStyle = {
  textDecoration: "underline",
}

export default function Navbar() {
  const { active, account, activate } = useWeb3React()

  async function connect() {
    try {
      await activate(injected)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <nav className="bg-green border-b-2 border-b-black shadow-xl">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {open ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="basis-1 flex items-center justify-start sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-source-code text-3xl font-medium">
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
                    className="font-source-code"
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
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {!active &&
            <button
              onClick={connect}
              type="button"
              className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
            
              <span>Connect wallet</span>
            </button>
            }
            { active &&
            <span>👋 {account.substring(0, 3)}...{account.substring(38)}</span>
            }
          </div>
        </div>
      </div>
    </nav>
  )
}

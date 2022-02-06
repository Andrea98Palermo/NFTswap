/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from "@headlessui/react"
import { CreditCardIcon, StatusOfflineIcon, MenuIcon, XIcon } from "@heroicons/react/outline"
import { NavLink } from "react-router-dom"
import { useState, useEffect } from "react"
import { connectWallet, getCurrentWalletConnected } from "../utils/wallet"

const navigation = [
  { name: "Marketplace", href: "/" },
  { name: "Upload", href: "/upload" },
  { name: "Profile", href: "/profile" },
]
let activeStyle = {
  textDecoration: "underline"
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function Navbar() {
  const [walletAddress, setWallet] = useState("")
  const [status, setStatus] = useState("")

  async function addWalletListener() {
    const { ethereum } = window
    if (ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0])
          setStatus(
            <span>
              <CreditCardIcon className="h-6 w-6" aria-hidden="true" />
            </span>
          )
        } else {
          setWallet("")
          setStatus(<StatusOfflineIcon className="h-6 w-6" aria-hidden="true" />)
        }
      })
    } else {
      setStatus(
        <StatusOfflineIcon className="h-6 w-6" aria-hidden="true" />
      )
    }
  }

  useEffect(() => {
    (async () => {
      addWalletListener()
      const { address, status } = await getCurrentWalletConnected()
      setWallet(address)
      status == "online"
        ? (
          setStatus(
            <span>
              <CreditCardIcon className="h-6 w-6" aria-hidden="true" />
            </span>
          )
        )
        : (
          setStatus(<StatusOfflineIcon className="h-6 w-6" aria-hidden="true" />)
        )
    })()
  }, [])

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet()
    setWallet(walletResponse.address)
    /* Must refresh the page to update the icon... */
    status == "online" ?
      setStatus(
        <span>
          <CreditCardIcon className="h-6 w-6" aria-hidden="true" />
        </span>
      ) :
      setStatus(<StatusOfflineIcon className="h-6 w-6" aria-hidden="true" />)
  }

  return (
    < Disclosure as="nav" className="bg-green border-b-2 border-b-black shadow-xl" >
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="basis-1 flex items-center justify-start sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <span className="font-source-code text-3xl font-medium">NFTswap</span>
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
                <button
                  onClick={connectWalletPressed}
                  type="button"
                  className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span className="sr-only">Connect wallet</span>
                  <span>{status}</span>
                </button>
                <span>{`${String(walletAddress).substring(0, 3)}...${String(walletAddress).substring(38)}`}</span>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                < Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={
                    classNames(
                      "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block px-3 py-2 rounded-md text-base font-medium"
                    )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )
      }
    </Disclosure >
  )
}

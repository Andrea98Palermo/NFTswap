import { useState } from "react"
import Proposals from "../components/Proposals"
import Bids from "../components/Bids"

// Profile component is used in src/components/Navbar.jsx
export default function Profile() {
  const [radio, setRadio] = useState("proposals")
  const [content, setContent] = useState(<Proposals />)

  return (
    <div className="container max-w-3xl mx-auto my-5 grid-cols-1 grid-rows-2">
      <main className="grid place-content-start p-4 mb-5">
        <div className="grid grid-cols-2 rounded-xl p-0.5 space-x-2 w-[15rem] shadow-lg" x-data="app">
          <div>
            <input type="radio" name="option" id="1" className="peer" checked={radio === "proposals"} onChange={() => {
              setContent(<Proposals />)
              setRadio("proposals")
            }} hidden />
            <label htmlFor="1"
              className="block text-center rounded-xl p-2 cursor-pointer select-none peer-checked:shadow-inner peer-checked:bg-gray-100">Proposals</label>
          </div>
          <div>
            <input type="radio" name="option" id="2" className="peer" checked={radio === "bids"} onChange={() => {
              setContent(<Bids />)
              setRadio("bids")
            }} hidden />
            <label htmlFor="2"
              className="block text-center rounded-xl p-2 cursor-pointer select-none peer-checked:shadow-inner peer-checked:bg-gray-100">Bids</label>
          </div>
        </div>
      </main>
      {content}
    </div>
  )
}
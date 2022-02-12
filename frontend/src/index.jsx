import { render } from "react-dom"
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import Main from "./components/Main"
import Upload from "./routes/upload"
import Profile from "./routes/profile"
import "./index.css"
import Navbar from "./components/Navbar"
import Spacer from "./components/Spacer"
import { Web3ReactProvider } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"

function getLibrary(provider) {
  return new Web3Provider(provider)
}

const rootElement = document.getElementById("root")
render(
  <BrowserRouter>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Navbar />
      <Spacer space={32} />
      <Routes>
        <Route path="/" element={<Main />}/>
        <Route path="upload" element={<Upload />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </Web3ReactProvider>
  </BrowserRouter>,
  rootElement
)
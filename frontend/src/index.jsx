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

const rootElement = document.getElementById("root")
render(
  <BrowserRouter>
    <Navbar />
    <Spacer space={32} />
    <Routes>
      <Route path="/" element={<Main />}/>
      <Route path="upload" element={<Upload />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  </BrowserRouter>,
  rootElement
)
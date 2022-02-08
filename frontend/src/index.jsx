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

const rootElement = document.getElementById("root")
render(
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Main />} className="container mx-auto"/>
      <Route path="upload" element={<Upload />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  </BrowserRouter>,
  rootElement
)
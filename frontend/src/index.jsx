import { render } from "react-dom"
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import Main from "./components/Main"
import Profile from "./routes/profile"
import "./index.css"

const rootElement = document.getElementById("root")
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  </BrowserRouter>,
  rootElement
)
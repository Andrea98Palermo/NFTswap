import { useState } from "react"
import Proposals from "../components/Proposals"

// Profile component is used in src/components/Navbar.jsx
export default function Profile() {
  const [content] = useState(<Proposals />)

  return (
    <span>
      {content}
    </span>
  )
}
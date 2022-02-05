import React from "react"

class Navbar extends React.Component {
  render() {
    return (
      <div>
        <ul id="nav">
          <li><a href="#">Marketplace</a></li>
          <li><a href="#">Upload</a></li>
          <li><a href="#">Profile</a></li>
        </ul>
      </div>
    )
  }
}

export { Navbar }
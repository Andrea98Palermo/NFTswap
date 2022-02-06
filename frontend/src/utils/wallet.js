export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts"
      })
      const obj = {
        status: "online",
        address: addressArray[0]
      }
      return obj
    } catch (err) {
      return {
        address: "",
        status: `😥 ${err.message}`
      }
    }
  } else {
    return {
      address: "",
      status: ("offline")
    }
  }
}

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts"
      })
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "online"
        }
      }
      return {
        address: "",
        status: "offline"
      }
    } catch (err) {
      return {
        address: "",
        status: `😥 ${err.message}`
      }
    }
  } else {
    return {
      address: "",
      status: ("offline")
    }
  }
}

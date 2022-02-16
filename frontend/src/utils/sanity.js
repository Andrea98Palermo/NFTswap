import sanityClient from "@sanity/client"


const API_KEY = process.env.REACT_APP_SANITY_API_KEY || ""

if (API_KEY === "") {
  console.error("Sanity API key not found")
}

export const sanityclient = sanityClient({
  projectId: "rguw4ia4",
  dataset: "production",
  apiVersion: "2021-08-31",
  useCdn: true,
  // Get Token from: https://sanity.io/dashboard/production/auth
  token: API_KEY,
})
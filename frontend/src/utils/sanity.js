import sanityClient from "@sanity/client"

export const sanityclient = sanityClient({
  projectId: "jxu0plpd",
  dataset: "production",
  useCdn: true,
  // TODO: Read token from environment variable
  // Get Token from: https://sanity.io/dashboard/production/auth
  token: "",
})

import Xrequest from "./request"
export const XrequestInstance = new Xrequest({
  timeout: 6000,
  baseURL: import.meta.env.VITE_APP_BASE_URL
})

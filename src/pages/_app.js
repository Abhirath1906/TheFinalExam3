import { AppProvider } from "../context/AppContext"
import "../pages/styles/global.css"
import "antd/dist/reset.css"

export default function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  )
}

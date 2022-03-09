import Chakra from "components/_app/Chakra"
import { Web3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { connectors, provider } from "connectors"
import "focus-visible/dist/focus-visible"
import type { AppProps } from "next/app"
import { IconContext } from "phosphor-react"
import { SWRConfig } from "swr"
import "theme/custom-scrollbar.css"
import fetcher from "utils/fetcher"
import { WagmiProvider } from "wagmi"

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
  <Chakra cookies={pageProps.cookies}>
    <IconContext.Provider
      value={{
        color: "currentColor",
        size: "1em",
        weight: "bold",
        mirrored: false,
      }}
    >
      <SWRConfig value={{ fetcher }}>
        <WagmiProvider provider={provider} connectors={connectors} autoConnect>
          <Web3ConnectionManager>
            <Component {...pageProps} />
          </Web3ConnectionManager>
        </WagmiProvider>
      </SWRConfig>
    </IconContext.Provider>
  </Chakra>
)

export { getServerSideProps } from "components/_app/Chakra"

export default App

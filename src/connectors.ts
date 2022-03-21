import { providers } from "ethers"
import { chain, defaultChains } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { WalletLinkConnector } from "wagmi/connectors/walletLink"

const provider = ({ chainId }) =>
  new providers.InfuraProvider(chainId, process.env.NEXT_PUBLIC_INFURA_ID)

const supportedChainIds = [/* 1,*/ 3]
const chains = defaultChains.filter((c) => supportedChainIds.includes(c.id))

const TOKEN_XYZ_CONTRACT = {
  1: "",
  3: "",
  5: "0x7cedb7C3532589b7b622676c49759ee87929878B",
}

const injected = new InjectedConnector({
  chains,
  options: { shimDisconnect: true },
})

const connectors = ({ chainId }) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ?? chain.mainnet.rpcUrls[0]
  return [
    injected,
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new WalletLinkConnector({
      chains,
      options: {
        appName: "Token.xyz",
        jsonRpcUrl: rpcUrl,
      },
    }),
  ]
}

const iconUrls = {
  1: "/networkLogos/ethereum.svg",
  3: "/networkLogos/ethereum.svg",
}

export { TOKEN_XYZ_CONTRACT, provider, chains, connectors, injected, iconUrls }

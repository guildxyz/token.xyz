import { chain, defaultChains, developmentChains } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { WalletLinkConnector } from "wagmi/connectors/walletLink"

const supportedChainIds =
  process.env.NODE_ENV === "development" ? [1337, /* 1,*/ 5] : [/* 1,*/ 5]
const chains =
  process.env.NODE_ENV === "development"
    ? [...developmentChains, ...defaultChains].filter((c) =>
        supportedChainIds.includes(c.id)
      )
    : [...defaultChains].filter((c) => supportedChainIds.includes(c.id))

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
  5: "/networkLogos/ethereum.svg",
}

export { chains, connectors, injected, iconUrls }

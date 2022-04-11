import { providers } from "ethers"
import { chain, defaultChains } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { WalletLinkConnector } from "wagmi/connectors/walletLink"

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

const supportedChainIds = [/* 1,*/ 3, 5]
enum ChainSlugs {
  "ethereum" = 1,
  "ropsten" = 3,
  "goerli" = 5,
}

// Default chain is Ropsten for now
const provider = ({ chainId }) =>
  new providers.InfuraProvider(
    supportedChainIds.includes(chainId) ? chainId : 3,
    process.env.NEXT_PUBLIC_INFURA_ID
  )

const chains = defaultChains.filter((c) => supportedChainIds.includes(c.id))

const TOKEN_XYZ_CONTRACT = {
  1: NULL_ADDRESS,
  3: "0x94a5e2490A5d6cf7fDC4D8825df33d2ba482f7ad",
  5: "0xc59540bC4242B33d0C0977b8a9E65044F6472946",
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
  5: "/networkLogos/ethereum.svg",
}

export {
  TOKEN_XYZ_CONTRACT,
  supportedChainIds,
  provider,
  chains,
  ChainSlugs,
  connectors,
  injected,
  iconUrls,
  NULL_ADDRESS,
}

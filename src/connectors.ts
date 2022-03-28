import { providers } from "ethers"
import { chain, defaultChains } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { WalletLinkConnector } from "wagmi/connectors/walletLink"

// Default chain is Ropsten for now
const provider = ({ chainId }) =>
  new providers.InfuraProvider(chainId ?? 3, process.env.NEXT_PUBLIC_INFURA_ID)

const supportedChainIds = [/* 1,*/ 3, 5]
const chainSlugs = {
  1: "ethereum",
  3: "ropsten",
  5: "goerli",
}
const chains = defaultChains.filter((c) => supportedChainIds.includes(c.id))

const TOKEN_XYZ_CONTRACT = {
  1: "0x0000000000000000000000000000000000000000",
  3: "0x32298Fe854FBf50e377be09533F5eFe42659f8FF",
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
  5: "/networkLogos/ethereum.svg",
}

export {
  TOKEN_XYZ_CONTRACT,
  provider,
  chains,
  chainSlugs,
  connectors,
  injected,
  iconUrls,
}

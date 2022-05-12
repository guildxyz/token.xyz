import { ChainSlugs } from "connectors"
import { useRouter } from "next/router"
import useSWR, { SWRResponse } from "swr"
import { TokenData } from "types"

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : process.env.NEXT_PUBLIC_API_URL

const fetchTokenData = (_: string, chain: string, address: string) =>
  fetch(`${baseUrl}/token/${chain}/${address}`)
    .then((data) => data.json())
    .then((tokenData) => ({ ...tokenData, address, chainId: ChainSlugs[chain] }))

const useTokenData = (
  chain?: string,
  tokenAddress?: string
): SWRResponse<TokenData & { address: string; chainId: number }> => {
  const router = useRouter()
  const routerChain = router.query.chain?.toString()
  const routerTokenAddress = router.query.token?.toString()

  const shouldFetch =
    router.isReady && (chain || routerChain) && (tokenAddress || routerTokenAddress)

  return useSWR<TokenData & { address: string; chainId: number }>(
    shouldFetch
      ? ["token", chain ?? routerChain, tokenAddress ?? routerTokenAddress]
      : null,
    fetchTokenData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      fallbackData: {
        address: null,
        chainId: null,
        owner: null,
        symbol: null,
        name: null,
        decimals: null,
        totalSupply: null,
        infoJSON: null,
      },
    }
  )
}

export default useTokenData

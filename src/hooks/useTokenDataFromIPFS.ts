import useSWR, { SWRResponse } from "swr"
import { TokenInfoJSON } from "types"

const fetchTokenData = (_: string, chain: string, tokenAddress: string) =>
  fetch(`/api/token/${chain}/${tokenAddress}`).then((data) => data.json())

const useTokenDataFromIpfs = (
  chain: string,
  tokenAddress: string
): SWRResponse<TokenInfoJSON> =>
  useSWR<TokenInfoJSON>(
    chain && tokenAddress ? ["tokenDataFromIpfs", chain, tokenAddress] : null,
    fetchTokenData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )

export default useTokenDataFromIpfs

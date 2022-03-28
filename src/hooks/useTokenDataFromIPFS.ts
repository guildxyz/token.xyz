import useSWR, { SWRResponse } from "swr"
import { TokenInfoJSON } from "types"

const fetchTokenData = (_: string, chain: string, tokenAddress: string) =>
  fetch(`/api/token/${chain}/${tokenAddress}`).then((data) => data.json())

const useTokenDataFromIpfs = (
  chain: string,
  tokenAddress: string
): SWRResponse<TokenInfoJSON> =>
  useSWR<TokenInfoJSON>(["tokenDataFromIpfs", chain, tokenAddress], fetchTokenData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  })

export default useTokenDataFromIpfs

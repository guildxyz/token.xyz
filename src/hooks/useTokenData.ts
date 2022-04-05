import useSWR, { SWRResponse } from "swr"
import { TokenData } from "types"

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : process.env.NEXT_PUBLIC_API_URL

const fetchTokenData = (endpoint: string) =>
  fetch(`${baseUrl}${endpoint}`).then((data) => data.json())

const useTokenData = (chain: string, tokenAddress: string): SWRResponse<TokenData> =>
  useSWR<TokenData>(
    chain && tokenAddress ? `/token/${chain}/${tokenAddress}` : null,
    fetchTokenData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )

export default useTokenData

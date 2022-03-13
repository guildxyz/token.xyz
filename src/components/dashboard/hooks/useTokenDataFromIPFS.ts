import useSWR, { SWRResponse } from "swr"
import { TokenInfoJSON } from "types"

const fetchTokenData = (address: string) =>
  fetch(`/api/token/${address}`).then((data) => data.json())

const useTokenDataFromIpfs = (tokenAddress: string): SWRResponse<TokenInfoJSON> =>
  useSWR<TokenInfoJSON>(tokenAddress, fetchTokenData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  })

export default useTokenDataFromIpfs

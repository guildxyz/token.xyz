import useSWR, { SWRResponse } from "swr"

const fetchTokenData = (address: string) =>
  fetch(`/api/token/${address}`).then((data) => data.json())

type ResponseType = {
  icon?: string
  airdrops?: Array<string>
  vestings?: Array<string>
}

const useTokenDataFromIpfs = (tokenAddress: string): SWRResponse<ResponseType> =>
  useSWR<ResponseType>(tokenAddress, fetchTokenData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  })

export default useTokenDataFromIpfs

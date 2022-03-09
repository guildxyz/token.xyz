import { ethers, Event } from "ethers"
import useSWR, { SWRResponse } from "swr"
import { useAccount } from "wagmi"
import useTokenXyzContract from "./useTokenXyzContract"

const getTokenDeployedEvents = (
  _: string,
  walletAddress: string,
  tokenXyzContract: ethers.Contract
): Promise<Array<string>> =>
  tokenXyzContract
    ?.queryFilter(tokenXyzContract.filters.TokenDeployed(walletAddress))
    .then((events: Array<Event>) => events.map((event) => event.args?.[2]))

const useMyTokens = (): SWRResponse<Array<string>> => {
  const [{ data: accountData, loading: accountDataLoading }] = useAccount()
  const tokenXyzContract = useTokenXyzContract()

  const swrResponse = useSWR<Array<string>>(
    accountData?.address && tokenXyzContract
      ? ["myTokens", accountData.address, tokenXyzContract]
      : null,
    getTokenDeployedEvents,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )

  return {
    ...swrResponse,
    isValidating: swrResponse.isValidating || accountDataLoading,
    data: swrResponse.data ?? [],
  }
}

export default useMyTokens

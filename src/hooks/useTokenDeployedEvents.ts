import { ethers, Event } from "ethers"
import useSWR, { SWRResponse } from "swr"
import { useAccount } from "wagmi"
import useTokenXyzContract from "./useTokenXyzContract"

const getTokenDeployedEvents = (
  _: string,
  walletAddress: string,
  tokenXyzContract: ethers.Contract
): Promise<Array<Event>> =>
  tokenXyzContract?.queryFilter(
    tokenXyzContract.filters.TokenDeployed(walletAddress)
  )

const useTokenDeployedEvents = (
  mode: "ALL" | "MY" = "MY"
): SWRResponse<Array<Event>> => {
  const [{ data: accountData, loading: accountDataLoading }] = useAccount()
  const tokenXyzContract = useTokenXyzContract()

  const shouldFetch =
    mode === "MY" ? accountData?.address && !!tokenXyzContract : !!tokenXyzContract

  const swrResponse = useSWR<Array<Event>>(
    shouldFetch
      ? [
          "tokenDeployedEvents",
          mode === "MY" ? accountData.address : null,
          tokenXyzContract,
        ]
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

export default useTokenDeployedEvents

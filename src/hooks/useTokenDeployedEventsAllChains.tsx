import { supportedChainIds, TOKEN_XYZ_CONTRACT } from "connectors"
import { Contract, Event, providers } from "ethers"
import TokenXyzABI from "static/abis/TokenXyzABI.json"
import useSWR, { SWRResponse } from "swr"
import { useAccount } from "wagmi"
import useTokenXyzContract from "./useTokenXyzContract"

type ResponseType = Record<typeof supportedChainIds[number], Array<Event>>

const getTokenDeployedEvents = async (
  _: string,
  walletAddress: string
): Promise<ResponseType> => {
  const events: ResponseType = {}

  for (const chainId of supportedChainIds) {
    const provider = new providers.InfuraProvider(
      chainId,
      process.env.NEXT_PUBLIC_INFURA_ID
    )
    const tokenXyzContract = new Contract(
      TOKEN_XYZ_CONTRACT[chainId],
      TokenXyzABI,
      provider
    )

    const eventsOnCurrentChain = await tokenXyzContract?.queryFilter(
      tokenXyzContract.filters.TokenDeployed(walletAddress)
    )

    if (eventsOnCurrentChain?.length) events[chainId] = eventsOnCurrentChain
  }

  return events
}

const useTokenDeployedEventsAllChains = (
  mode: "ALL" | "MY" = "MY"
): SWRResponse<ResponseType> => {
  const [{ data: accountData, loading: accountDataLoading }] = useAccount()
  const tokenXyzContract = useTokenXyzContract()

  const shouldFetch = mode === "MY" ? accountData?.address : true

  const swrResponse = useSWR<ResponseType>(
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
    data: swrResponse.data ?? {},
  }
}

export default useTokenDeployedEventsAllChains

import { Contract } from "ethers"
import useSWR, { SWRResponse } from "swr"
import { erc20ABI, useContract, useProvider } from "wagmi"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const getTokenData = (
  _: string,
  __: string,
  contract: Contract
): Promise<{ owner: string; symbol: string; name: string }> =>
  Promise.all([
    contract
      .queryFilter(
        contract.filters.Transfer("0x0000000000000000000000000000000000000000")
      )
      .then((events) => events?.[0]?.args?.to || null),
    contract.symbol(),
    contract.name(),
  ])
    .then(([owner, symbol, name]) => ({ owner, symbol, name }))
    .catch((_) => ({ owner: null, symbol: null, name: null }))

const useTokenDataFromContract = (
  tokenAddress: string
): SWRResponse<{ owner: string; symbol: string; name: string }> => {
  const shouldFetch = ADDRESS_REGEX.test(tokenAddress)

  const provider = useProvider()
  const tokenContract = useContract({
    addressOrName: tokenAddress,
    contractInterface: erc20ABI,
    signerOrProvider: provider,
  })

  const swrResponse = useSWR<{ owner: string; symbol: string; name: string }>(
    shouldFetch ? ["tokenData", tokenAddress, tokenContract] : null,
    getTokenData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 100,
    }
  )

  return {
    ...swrResponse,
    /**
     * Doing this instead of using initialData to make sure it fetches when
     * shouldFetch becomes true
     */
    data: swrResponse.data ?? {
      owner: undefined,
      symbol: undefined,
      name: undefined,
    },
  }
}

export default useTokenDataFromContract

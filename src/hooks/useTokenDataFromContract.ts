import { NULL_ADDRESS } from "connectors"
import { Contract } from "ethers"
import useSWR, { SWRResponse } from "swr"
import { erc20ABI, useContract, useProvider } from "wagmi"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const getTokenData = (
  _: string,
  __: string,
  contract: Contract
): Promise<{ owner: string; symbol: string; name: string; decimals: number }> =>
  Promise.all([
    contract
      .queryFilter(contract.filters.Transfer(NULL_ADDRESS))
      .then((events) => events?.[0]?.args?.to || null),
    contract.symbol(),
    contract.name(),
    contract.decimals(),
  ])
    .then(([owner, symbol, name, decimals]) => ({ owner, symbol, name, decimals }))
    .catch((_) => ({ owner: null, symbol: null, name: null, decimals: null }))

const useTokenDataFromContract = (
  tokenAddress: string
): SWRResponse<{
  owner: string
  symbol: string
  name: string
  decimals: number
}> => {
  const shouldFetch = ADDRESS_REGEX.test(tokenAddress)

  const provider = useProvider()

  const tokenContract = useContract({
    addressOrName: tokenAddress || NULL_ADDRESS,
    contractInterface: erc20ABI,
    signerOrProvider: provider,
  })

  const swrResponse = useSWR<{
    owner: string
    symbol: string
    name: string
    decimals: number
  }>(shouldFetch ? ["tokenData", tokenAddress, tokenContract] : null, getTokenData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryInterval: 100,
  })

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
      decimals: undefined,
    },
  }
}

export default useTokenDataFromContract

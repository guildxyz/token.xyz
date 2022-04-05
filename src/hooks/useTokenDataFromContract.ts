import { ChainSlugs, NULL_ADDRESS } from "connectors"
import { Contract, providers } from "ethers"
import { useRouter } from "next/router"
import { useMemo } from "react"
import useSWR, { SWRResponse } from "swr"
import { erc20ABI, useContract, useProvider } from "wagmi"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

type ResponseType = {
  owner: string
  symbol: string
  name: string
  decimals: number
  totalSupply: number
}

const getTokenData = (
  _: string,
  __: string,
  contract: Contract
): Promise<ResponseType> =>
  Promise.all([
    contract
      .queryFilter(contract.filters.Transfer(NULL_ADDRESS))
      .then((events) => events?.[0]?.args?.to || null),
    contract.symbol(),
    contract.name(),
    contract.decimals(),
    contract.totalSupply(),
  ])
    .then(([owner, symbol, name, decimals, totalSupply]) => ({
      owner,
      symbol,
      name,
      decimals,
      totalSupply,
    }))
    .catch((_) => ({
      owner: null,
      symbol: null,
      name: null,
      decimals: null,
      totalSupply: null,
    }))

const useTokenDataFromContract = (
  tokenAddress: string
): SWRResponse<ResponseType> => {
  const router = useRouter()
  const chain = router?.query?.chain?.toString()

  const shouldFetch = ADDRESS_REGEX.test(tokenAddress)

  const provider = useProvider()

  const localProvider = useMemo(() => {
    const parsedChain = ChainSlugs[chain] ? parseInt(ChainSlugs[chain]) : undefined
    if (!parsedChain) return undefined
    return new providers.InfuraProvider(parsedChain)
  }, [chain])

  const tokenContract = useContract({
    addressOrName: tokenAddress || NULL_ADDRESS,
    contractInterface: erc20ABI,
    signerOrProvider: localProvider ?? provider,
  })

  const swrResponse = useSWR<ResponseType>(
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
      decimals: undefined,
      totalSupply: undefined,
    },
  }
}

export default useTokenDataFromContract

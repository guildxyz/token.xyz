import { useAllocation } from "components/[token]/components/common/AllocationContext"
import { Contract } from "ethers"
import { useMemo } from "react"
import MerkleDistributorABI from "static/abis/MerkleDistributorABI.json"
import useSWR, { SWRResponse } from "swr"
import { useAccount, useContract, useProvider } from "wagmi"

const getMerkleData = (
  contract: Contract,
  index: number
): Promise<{ owner: string; isClaimed: boolean }> =>
  Promise.all([
    contract.owner(),
    typeof index === "number" ? contract.isClaimed(index) : false,
  ])
    .then(([owner, isClaimed]) => ({ owner, isClaimed }))
    .catch((error) => {
      console.log('Error in "getMerkleData" hook:', error)
      return { owner: null, isClaimed: null }
    })

const useAirdropDataWithIndex = (): SWRResponse<{
  owner: string
  isClaimed: boolean
}> => {
  const provider = useProvider()
  const [{ data: accountData, error, loading }] = useAccount()

  const { merkleDistribution } = useAllocation()

  const index = useMemo(
    () =>
      accountData && merkleDistribution?.claims
        ? merkleDistribution.claims[accountData.address]?.index
        : null,
    [accountData, merkleDistribution]
  )

  const merkleDistributorContract = useContract({
    addressOrName: merkleDistribution?.contractAddress,
    contractInterface: MerkleDistributorABI,
    signerOrProvider: provider,
  })

  const shouldFetch =
    merkleDistribution?.contractAddress &&
    typeof index === "number" &&
    accountData &&
    merkleDistributorContract &&
    !error

  const swrResponse = useSWR(
    shouldFetch ? [merkleDistributorContract, index] : null,
    getMerkleData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )

  return {
    ...swrResponse,
    isValidating: loading || swrResponse.isValidating,
    data: swrResponse?.data ?? { isClaimed: undefined, owner: undefined },
  }
}

export default useAirdropDataWithIndex

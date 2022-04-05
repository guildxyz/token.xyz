import { useAllocation } from "components/[token]/components/common/AllocationContext"
import { BigNumber, Contract } from "ethers"
import { useMemo } from "react"
import MerkleVestingABI from "static/abis/MerkleVestingABI.json"
import useSWR, { SWRResponse } from "swr"
import { useAccount, useContract, useSigner } from "wagmi"

type ResponseType = { owner: string; claimableAmount: BigNumber; claimed: BigNumber }

const getCohortDetails = (
  _: string,
  contract: Contract,
  merkleRoot: string,
  index: number,
  address: string,
  fullAmount: string
) =>
  Promise.all([
    contract.owner(),
    contract
      .getClaimableAmount(merkleRoot, index, address, fullAmount)
      .catch((_) => BigNumber.from(0)),
    contract.getClaimed(merkleRoot, address),
  ])
    .then(([owner, claimableAmount, claimed]) => ({
      owner,
      claimableAmount,
      claimed,
    }))
    .catch((error) => {
      console.log("Error in getCohortDetails hook:", error)
      return {
        owner: null,
        claimableAmount: null,
        claimed: null,
      }
    })

const useCohort = (merkleRoot: string): SWRResponse<ResponseType> => {
  const [{ data: accountData, error }] = useAccount()
  const [{ data: signerData }] = useSigner()
  const { merkleVesting } = useAllocation()
  const contract = useContract({
    addressOrName: merkleVesting?.contractAddress,
    contractInterface: MerkleVestingABI,
    signerOrProvider: signerData,
  })

  const claims = useMemo(
    () =>
      merkleVesting?.cohorts?.find((cohort) => cohort.merkleRoot === merkleRoot)
        ?.claims || {},
    [merkleRoot, merkleVesting]
  )

  const userVestingData = useMemo(
    () => (accountData && claims ? claims[accountData?.address] : null),
    [accountData, claims]
  )

  const shouldFetch =
    signerData && contract && merkleRoot && accountData && userVestingData && !error

  return useSWR<ResponseType>(
    shouldFetch
      ? [
          "cohort",
          contract,
          merkleRoot,
          userVestingData?.index,
          accountData?.address,
          userVestingData?.amount,
        ]
      : null,
    getCohortDetails,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )
}

export default useCohort

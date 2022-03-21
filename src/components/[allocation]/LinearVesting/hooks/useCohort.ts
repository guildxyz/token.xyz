import { useAllocation } from "components/[allocation]/common/AllocationContext"
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

const useCohort = (): SWRResponse<ResponseType> => {
  const [{ data: accountData, error }] = useAccount()
  const [{ data: signerData }] = useSigner()
  const { merkleRoot, claims, vestingContract } = useAllocation()
  const contract = useContract({
    addressOrName: vestingContract,
    contractInterface: MerkleVestingABI,
    signerOrProvider: signerData,
  })

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

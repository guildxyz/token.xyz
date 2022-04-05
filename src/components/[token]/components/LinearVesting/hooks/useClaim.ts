import { useAllocation } from "components/[token]/components/common/AllocationContext"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useMemo } from "react"
import MerkleVestingABI from "static/abis/MerkleVestingABI.json"
import processContractInteractionError from "utils/processContractInteractionError"
import { useAccount, useContract, useSigner } from "wagmi"

const useClaim = (merkleRoot: string) => {
  const [{ data: accountData }] = useAccount()
  const [{ data: signerData }] = useSigner()
  const { merkleVesting } = useAllocation()
  const toast = useToast()

  const merkleVestingContract = useContract({
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
    () => (accountData && claims ? claims[accountData.address] : null),
    [accountData, claims]
  )

  const claim = async () =>
    merkleVestingContract
      .claim(
        merkleRoot,
        userVestingData?.index,
        accountData?.address,
        userVestingData?.amount,
        userVestingData?.proof
      )
      .then((res) => res.wait())

  return useSubmit<null, unknown>(claim, {
    onError: (claimError) =>
      toast({
        title: "Error claiming tokens",
        description: processContractInteractionError(claimError),
        status: "error",
      }),
    onSuccess: () =>
      toast({
        title: "Successfully claimed tokens!",
        status: "success",
      }),
  })
}

export default useClaim

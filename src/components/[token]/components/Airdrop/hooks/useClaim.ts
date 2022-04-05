import { useAllocation } from "components/[token]/components/common/AllocationContext"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useMemo } from "react"
import MerkleDistributorABI from "static/abis/MerkleDistributorABI.json"
import processContractInteractionError from "utils/processContractInteractionError"
import { useAccount, useContract, useSigner } from "wagmi"

const useClaim = () => {
  const [{ data: accountData }] = useAccount()
  const [{ data: signerData }] = useSigner()
  const { merkleDistribution } = useAllocation()
  const toast = useToast()

  const merkleDistributorContract = useContract({
    addressOrName: merkleDistribution?.contractAddress,
    contractInterface: MerkleDistributorABI,
    signerOrProvider: signerData,
  })

  const userMerkleDistributorData = useMemo(
    () =>
      accountData && merkleDistribution?.claims
        ? merkleDistribution.claims[accountData.address]
        : null,
    [accountData, merkleDistribution]
  )

  const claim = async () =>
    merkleDistributorContract
      .claim(
        userMerkleDistributorData?.index,
        accountData?.address,
        userMerkleDistributorData?.amount,
        userMerkleDistributorData?.proof
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

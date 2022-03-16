import { useAllocation } from "components/[allocation]/common/AllocationContext"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useMemo } from "react"
import MerkleDistributorABI from "static/abis/MerkleDistributorABI.json"
import processContractInteractionError from "utils/processContractInteractionError"
import { useAccount, useContract, useSigner } from "wagmi"

const useClaim = () => {
  const [{ data: accountData }] = useAccount()
  const [{ data: signerData }] = useSigner()
  const { claims, merkleDistributorContract: contractAddress } = useAllocation()
  const toast = useToast()

  const merkleDistributorContract = useContract({
    addressOrName: contractAddress,
    contractInterface: MerkleDistributorABI,
    signerOrProvider: signerData,
  })

  const userMerkleDistributorData = useMemo(
    () => (accountData && claims ? claims[accountData.address] : null),
    [accountData, claims]
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

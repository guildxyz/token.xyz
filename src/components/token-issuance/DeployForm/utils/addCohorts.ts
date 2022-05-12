import { Contract, Signer } from "ethers"
import MerkleVestingABI from "static/abis/MerkleVestingABI.json"
import { AllocationFormType } from "types"
import { MerkleDistributorInfo } from "utils/merkle/parseBalanceMap"
import monthsToSecond from "./monthsToSeconds"

const addCohorts = (config: {
  signerData: Signer
  distributionData: Array<AllocationFormType>
  merkleTrees: Array<MerkleDistributorInfo>
  merkleVestingContractAddress: string
}) => {
  const merkleVestingContract = new Contract(
    config.merkleVestingContractAddress,
    MerkleVestingABI,
    config.signerData
  )

  const addCohortCalls = []

  // Preparing the "addCohort" calls
  config.distributionData?.forEach((allocation, index) => {
    if (allocation.vestingType !== "LINEAR_VESTING") return

    // Distribution duration in seconds
    const distributionDuration = monthsToSecond(allocation.distributionDuration)

    // For now...
    // TODO: user should pick the start date!
    const distributionStart = 0

    const cliff = monthsToSecond(allocation.cliff)
    const vestingPeriod = monthsToSecond(allocation.vestingPeriod)

    addCohortCalls.push(
      merkleVestingContract.interface.encodeFunctionData(
        "addCohort(bytes32,uint64,uint64,uint64,uint64)",
        [
          config.merkleTrees?.[index]?.merkleRoot,
          distributionStart,
          distributionDuration,
          vestingPeriod,
          cliff,
        ]
      )
    )
  })

  return merkleVestingContract
    .multicall(addCohortCalls)
    .then((addCohortCallsRes) => addCohortCallsRes?.wait())
}

export default addCohorts

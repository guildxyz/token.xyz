import { Contract, utils } from "ethers"
import { AllocationFormType } from "types"
import generateMerkleTree from "utils/merkle/generateMerkleTree"
import { parseBalanceMap } from "utils/merkle/parseBalanceMap"
import monthsToSecond from "./monthsToSeconds"

const createMerkleContracts = (
  tokenXyzContract: Contract,
  config: {
    tokenData: {
      address: string
      urlName: string
      deployer: string
    }
    distributionData?: Array<AllocationFormType>
    merkleVestingContractAddress?: string
  },
  update: (arg: { data: Record<string, any> }) => void,
  skip: () => void
) => {
  // If there's no airdrop/vesting data, we can skip this step
  if (
    !config.distributionData?.filter(
      (allocation) =>
        allocation.vestingType === "NO_VESTING" ||
        allocation.vestingType === "LINEAR_VESTING"
    )?.length
  )
    return skip()

  // Generating and storing merkle trees, so we don't need to regenerate them where we need to use them
  const merkleTrees = config.distributionData.map((allocation) =>
    parseBalanceMap(generateMerkleTree(allocation.allocationAddressesAmounts))
  )

  // Saving the merkle trees to the context, so we can use them later
  // send("UPDATE_CONTEXT", { data: { merkleTrees } })
  update({ data: { merkleTrees } })

  // Preparing the contract calls
  const contractCalls = []
  let abiEncodedMerkleVestingArgs
  const abiEncodedMerkleDistributorArgs = []

  const shouldCreateVesting =
    !config.merkleVestingContractAddress &&
    config.distributionData.some(
      (allocation) => allocation.vestingType === "LINEAR_VESTING"
    )

  // Deploying 1 vesting contract if needed
  if (shouldCreateVesting) {
    contractCalls.push(
      tokenXyzContract.interface.encodeFunctionData(
        "createVesting(string,address,address)",
        [
          config.tokenData.urlName,
          config.tokenData.address,
          config.tokenData.deployer,
        ]
      )
    )

    abiEncodedMerkleVestingArgs = utils.defaultAbiCoder
      .encode(
        // address token, address owner
        ["address", "address"],
        [config.tokenData.address, config.tokenData.deployer]
      )
      ?.replace("0x", "")
  }

  // Preparing the "createAirdrop" call(s) - 1 airdrop = 1 new createAirdrop call
  config.distributionData?.forEach((allocation, index) => {
    if (allocation.vestingType !== "NO_VESTING") return

    // Distribution duration in seconds
    const distributionDuration = monthsToSecond(allocation.distributionDuration)

    contractCalls.push(
      tokenXyzContract.interface.encodeFunctionData(
        "createAirdrop(string,address,bytes32,uint256,address)",
        [
          config.tokenData.urlName,
          config.tokenData.address,
          merkleTrees?.[index]?.merkleRoot,
          distributionDuration,
          config.tokenData.deployer,
        ]
      )
    )

    abiEncodedMerkleDistributorArgs.push(
      utils.defaultAbiCoder
        .encode(
          // address token, bytes32 merkleRoot, uint256 distributionDuration, address owner
          ["address", "bytes32", "uint256", "address"],
          [
            config.tokenData.address,
            merkleTrees?.[index]?.merkleRoot,
            distributionDuration,
            config.tokenData.deployer,
          ]
        )
        ?.replace("0x", "")
    )
  })

  // Saving encoded data to the context, because we'll use it for contract verification
  update({
    data: { abiEncodedMerkleVestingArgs, abiEncodedMerkleDistributorArgs },
  })

  if (!contractCalls?.length) return Promise.resolve()

  return tokenXyzContract
    .multicall(contractCalls)
    .then((multicallRes) => multicallRes?.wait())
}

export default createMerkleContracts

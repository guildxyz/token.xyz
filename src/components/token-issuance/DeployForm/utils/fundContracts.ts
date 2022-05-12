import { Contract, Signer, utils } from "ethers"
import { AllocationFormType } from "types"
import { erc20ABI } from "wagmi"
import converter from "./converter"

const fundContracts = (
  config: {
    tokenData: {
      address: string
      decimals: number
    }
    signerData: Signer
    distributionData?: Array<AllocationFormType>
    merkleDistributorContractAddresses?: Array<string>
    merkleVestingContractAddress?: string
  },
  send: (param: string) => void
) => {
  const airdropAmount = converter(
    config.distributionData?.filter(
      (allocation) => allocation.vestingType === "NO_VESTING"
    )
  )
  const vestingAmount = converter(
    config.distributionData?.filter(
      (allocation) => allocation.vestingType === "LINEAR_VESTING"
    )
  )

  // This should not happen, but in case something goes wrong, we can skip this step (and maybe fund the contracts manually later)
  if (!airdropAmount && !vestingAmount) return send("SKIP")

  const deployedTokenContract = new Contract(
    config.tokenData.address,
    erc20ABI,
    config.signerData
  )

  const transfers = []

  if (config.merkleDistributorContractAddresses?.length && airdropAmount) {
    config.distributionData
      ?.filter((allocation) => allocation.vestingType === "NO_VESTING")
      ?.forEach((allocation, index) => {
        const fundingAmount = allocation.allocationAddressesAmounts
          ?.map((data) => parseInt(data.amount))
          ?.reduce((amount1, amount2) => amount1 + amount2, 0)

        transfers.push(
          deployedTokenContract
            ?.transfer(
              config.merkleDistributorContractAddresses[index],
              utils.parseUnits(fundingAmount.toString(), config.tokenData.decimals)
            )
            .then((res) => res.wait())
        )
      })
  }

  if (config.merkleVestingContractAddress && vestingAmount) {
    transfers.push(
      deployedTokenContract
        ?.transfer(
          config.merkleVestingContractAddress,
          utils.parseUnits(vestingAmount.toString(), config.tokenData.decimals)
        )
        .then((res) => res.wait())
    )
  }

  return Promise.all(transfers)
}

export default fundContracts

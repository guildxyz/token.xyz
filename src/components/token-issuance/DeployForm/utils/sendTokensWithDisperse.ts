import { Contract, Signer, utils } from "ethers"
import DisperseABI from "static/abis/DisperseABI.json"
import { AllocationFormType } from "types"
import { erc20ABI } from "wagmi"
import converter from "./converter"

const sendTokensWithDisperse = async (
  signer: Signer,
  tokenAddress: string,
  decimals: number,
  distributionData: Array<AllocationFormType>
) => {
  const disperseContract = new Contract(
    process.env.NEXT_PUBLIC_DISPERSE_CONTRACT_ADDRESS,
    DisperseABI,
    signer
  )

  const disperseDistribution = distributionData?.find(
    (allocation) => allocation.vestingType === "DISTRIBUTE"
  )

  // Allow the Disperse contract to spend tokens from user's wallet
  const disperseAmount = converter(
    distributionData?.filter((allocation) => allocation.vestingType === "DISTRIBUTE")
  )

  const erc20Contract = new Contract(tokenAddress, erc20ABI, signer)
  const fullAmount = utils.parseUnits(disperseAmount.toString(), decimals)

  const approve = await erc20Contract.approve(
    process.env.NEXT_PUBLIC_DISPERSE_CONTRACT_ADDRESS,
    fullAmount
  )
  const approved = await approve?.wait()

  if (approved) {
    const recipients = disperseDistribution.allocationAddressesAmounts?.map(
      ({ address }) => address
    )

    const values = disperseDistribution.allocationAddressesAmounts?.map(
      ({ amount }) => utils.parseUnits(amount.toString(), decimals)
    )

    return disperseContract
      .disperseTokenSimple(tokenAddress, recipients, values)
      .then((res) => res.wait())
  }

  return Promise.reject()
}

export default sendTokensWithDisperse

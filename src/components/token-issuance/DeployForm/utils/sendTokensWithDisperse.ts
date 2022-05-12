import { Contract, Signer, utils } from "ethers"
import DisperseABI from "static/abis/DisperseABI.json"
import { AllocationFormType } from "types"
import { erc20ABI } from "wagmi"
import converter from "./converter"

const sendTokensWithDisperse = async (config: {
  signerData: Signer
  tokenData: {
    address: string
    decimals: number
  }
  distributionData: Array<AllocationFormType>
}) => {
  const disperseContract = new Contract(
    process.env.NEXT_PUBLIC_DISPERSE_CONTRACT_ADDRESS,
    DisperseABI,
    config.signerData
  )

  const disperseDistribution = config.distributionData?.find(
    (allocation) => allocation.vestingType === "DISTRIBUTE"
  )

  // Allow the Disperse contract to spend tokens from user's wallet
  const disperseAmount = converter(
    config.distributionData?.filter(
      (allocation) => allocation.vestingType === "DISTRIBUTE"
    )
  )

  const erc20Contract = new Contract(
    config.tokenData.address,
    erc20ABI,
    config.signerData
  )
  const fullAmount = utils.parseUnits(
    disperseAmount.toString(),
    config.tokenData.decimals
  )

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
      ({ amount }) => utils.parseUnits(amount.toString(), config.tokenData.decimals)
    )

    return disperseContract
      .disperseTokenSimple(config.tokenData.address, recipients, values)
      .then((res) => res.wait())
  }

  return Promise.reject()
}

export default sendTokensWithDisperse

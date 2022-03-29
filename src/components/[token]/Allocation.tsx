import { Spinner, Text } from "@chakra-ui/react"
import { ConfettiProvider } from "components/common/ConfettiContext"
import Airdrop from "components/[token]/components/Airdrop"
import BondVesting from "components/[token]/components/BondVesting"
import { AllocationProvider } from "components/[token]/components/common/AllocationContext"
import LinearVesting from "components/[token]/components/LinearVesting"
import useAllocationData from "hooks/useAllocationData"
import useTokenDataFromIpfs from "hooks/useTokenDataFromIPFS"
import { useRouter } from "next/router"
import { VestingTypes } from "types"

type Props = {
  allocationPrettyUrl: string
}

const Allocation = ({ allocationPrettyUrl }: Props): JSX.Element => {
  const router = useRouter()
  const chain = router.query?.chain?.toString()
  const tokenAddress = router.query?.token?.toString()

  const { data: tokenInfo } = useTokenDataFromIpfs(chain, tokenAddress)

  const vestingTypesComponents: Record<VestingTypes, JSX.Element> = {
    NO_VESTING: <Airdrop />,
    LINEAR_VESTING: <LinearVesting />,
    BOND_VESTING: <BondVesting />,
  }

  const generateFilePath = (fileName: string) =>
    fileName ? `${chain}/${tokenAddress}/${fileName}` : null

  const { data, error } = useAllocationData(
    tokenInfo
      ? generateFilePath(
          tokenInfo.airdrops
            .concat(tokenInfo.vestings)
            ?.find((allocation) => allocation.prettyUrl === allocationPrettyUrl)
            ?.fileName
        )
      : null
  )

  return (
    <>
      {data?.vestingType ? (
        <ConfettiProvider>
          <AllocationProvider initialData={data}>
            {vestingTypesComponents[data.vestingType]}
          </AllocationProvider>
        </ConfettiProvider>
      ) : error ? (
        <Text>Could not load data.</Text>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default Allocation

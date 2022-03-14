import Layout from "components/common/Layout"
import useAllocationData from "components/dashboard/hooks/useAllocationData"
import useTokenDataFromIpfs from "components/dashboard/hooks/useTokenDataFromIPFS"
import Airdrop from "components/[allocation]/Airdrop"
import BondVesting from "components/[allocation]/BondVesting"
import LinearVesting from "components/[allocation]/LinearVesting"
import { useRouter } from "next/router"
import { VestingTypes } from "types"

const Page = (): JSX.Element => {
  const router = useRouter()
  const tokenAddress = router.query?.token?.toString()
  const allocationPrettyUrl = router.query?.allocation?.toString()

  const { data: tokenInfo } = useTokenDataFromIpfs(tokenAddress)

  const vestingTypesComponents: Record<VestingTypes, JSX.Element> = {
    NO_VESTING: <Airdrop />,
    LINEAR_VESTING: <LinearVesting />,
    BOND_VESTING: <BondVesting />,
  }

  const generateFilePath = (fileName: string) =>
    fileName ? `${tokenAddress}/${fileName}` : null

  const { data, isValidating, error } = useAllocationData(
    tokenInfo
      ? generateFilePath(
          tokenInfo.airdrops
            .concat(tokenInfo.vestings)
            ?.find((allocation) => allocation.prettyUrl === allocationPrettyUrl)
            ?.fileName
        )
      : null
  )

  console.log("DATA", data)

  return (
    <Layout title={error ? "Error" : data ? data.name : "Loading... "}>
      {data?.vestingType && vestingTypesComponents[data.vestingType]}
    </Layout>
  )
}

export default Page

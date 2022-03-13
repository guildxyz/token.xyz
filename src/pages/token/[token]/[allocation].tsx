import Layout from "components/common/Layout"
import useAllocationData from "components/dashboard/hooks/useAllocationData"
import useTokenDataFromIpfs from "components/dashboard/hooks/useTokenDataFromIPFS"
import { useRouter } from "next/router"

const Page = (): JSX.Element => {
  const router = useRouter()
  const tokenAddress = router.query?.token?.toString()
  const allocationPrettyUrl = router.query?.allocation?.toString()

  const { data: tokenInfo } = useTokenDataFromIpfs(tokenAddress)

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

  return <Layout title={error ? "Error" : data ? data.name : "Loading... "}></Layout>
}

export default Page

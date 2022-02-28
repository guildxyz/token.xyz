import { Button } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import useTokenXyzContract from "hooks/useTokenXyzContract"
import { useEffect } from "react"
import { useAccount } from "wagmi"

const Page = (): JSX.Element => {
  const [{ data: accountData }] = useAccount()
  const tokenXyzContract = useTokenXyzContract()

  const logDeployedTokens = async () => {
    const res = await tokenXyzContract.getDeployedTokens("test")
    console.log(res)
  }

  useEffect(() => {
    if (!tokenXyzContract) return
    console.log(tokenXyzContract)
  }, [tokenXyzContract])

  return (
    <Layout title="Home">
      {accountData?.address && (
        <Button onClick={logDeployedTokens}>Log deployed tokens</Button>
      )}
    </Layout>
  )
}

export default Page

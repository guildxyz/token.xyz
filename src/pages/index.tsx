import { SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import TokenCard from "components/dashboard/TokenCard"
import { chainSlugs } from "connectors"
import useAllTokens from "hooks/useAllTokens"
import { useNetwork } from "wagmi"

const Page = (): JSX.Element => {
  const { data, isValidating } = useAllTokens()
  const [{ data: networkData, loading }] = useNetwork()

  return (
    <Layout title="Home">
      <SimpleGrid
        columns={{ base: 1, sm: 2, lg: 3 }}
        gap={{ base: 4, md: 6 }}
        pt={{ base: 4, md: 9 }}
        pb={{ base: 20, md: 14 }}
      >
        {isValidating || loading ? (
          <Spinner />
        ) : !data?.length ? (
          <Text>0 deployed tokens. :(</Text>
        ) : (
          data.map((token) => (
            <TokenCard
              key={token}
              // TODO: maybe we shouldn't fallback to 3 here, but we should have a URL query param for the chain?
              chain={chainSlugs[networkData?.chain?.id || 3]}
              address={token}
            />
          ))
        )}
      </SimpleGrid>
    </Layout>
  )
}

export default Page

import { SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import TokenCard from "components/dashboard/TokenCard"
import { ChainSlugs } from "connectors"
import useMyTokens from "hooks/useMyTokens"
import { useNetwork } from "wagmi"

const Page = (): JSX.Element => {
  const [{ data: networkData, loading }] = useNetwork()
  const { isValidating, data: tokens } = useMyTokens()

  return (
    <Layout title="Dashboard">
      <Section title="My tokens">
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={{ base: 4, md: 6 }}>
          {loading || loading ? (
            <Spinner />
          ) : !tokens?.length ? (
            <Text>It seems like you haven't deployed a token yet.</Text>
          ) : (
            tokens.map((token) => (
              <TokenCard
                key={token}
                // TODO: maybe we shouldn't fallback to 3 here, but we should have a URL query param for the chain?
                chain={ChainSlugs[networkData?.chain?.id || 3]}
                address={token}
              />
            ))
          )}
        </SimpleGrid>
      </Section>
    </Layout>
  )
}

export default Page

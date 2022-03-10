import { SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import TokenCard from "components/dashboard/TokenCard"
import useMyTokens from "hooks/useMyTokens"

const Page = (): JSX.Element => {
  const { isValidating: loading, data: tokens } = useMyTokens()

  return (
    <Layout title="Dashboard">
      <Section title="My tokens">
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={{ base: 4, md: 6 }}>
          {loading ? (
            <Spinner />
          ) : !tokens?.length ? (
            <Text>It seems like you haven't deployed a token yet.</Text>
          ) : (
            tokens.map((token) => <TokenCard key={token} address={token} />)
          )}
        </SimpleGrid>
      </Section>
    </Layout>
  )
}

export default Page

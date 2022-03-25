import { SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import TokenCard from "components/dashboard/TokenCard"
import useAllTokens from "hooks/useAllTokens"

const Page = (): JSX.Element => {
  const { data, isValidating } = useAllTokens()

  return (
    <Layout title="Home">
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={{ base: 4, md: 6 }}>
        {isValidating ? (
          <Spinner />
        ) : !data?.length ? (
          <Text>0 deployed tokens. :(</Text>
        ) : (
          data.map((token) => <TokenCard key={token} address={token} />)
        )}
      </SimpleGrid>
    </Layout>
  )
}

export default Page

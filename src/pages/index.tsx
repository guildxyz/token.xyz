import { SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import TokenCard from "components/dashboard/TokenCard"
import { ChainSlugs } from "connectors"
import useTokenDeployedEventsAllChains from "hooks/useTokenDeployedEventsAllChains"
import { useMemo } from "react"

const Page = (): JSX.Element => {
  const { data, isValidating } = useTokenDeployedEventsAllChains("ALL")

  const mappedTokens: Array<{
    chainSlug: string
    tokenAddress: string
  }> = useMemo(() => {
    if (!data) return []

    const tokens = []

    Object.keys(data).forEach((chainId) => {
      const chainSlug = ChainSlugs[chainId]
      const tokenAddresses =
        data[chainId]?.map((event) => event.args?.[2]?.toLowerCase()) ?? []
      tokenAddresses.forEach((tokenAddress) => {
        tokens.push({
          chainSlug,
          tokenAddress,
        })
      })
    })

    return tokens
  }, [data])

  return (
    <Layout title="Home">
      <SimpleGrid
        columns={{ base: 1, sm: 2, lg: 3 }}
        gap={{ base: 4, md: 6 }}
        pt={{ base: 4, md: 9 }}
        pb={{ base: 20, md: 14 }}
      >
        {isValidating ? (
          <Spinner />
        ) : !mappedTokens?.length ? (
          <Text>0 deployed tokens. :(</Text>
        ) : (
          mappedTokens.map((token) => (
            <TokenCard
              key={token.tokenAddress}
              chain={token.chainSlug}
              address={token.tokenAddress}
            />
          ))
        )}
      </SimpleGrid>
    </Layout>
  )
}

export default Page

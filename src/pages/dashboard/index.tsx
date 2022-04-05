import { SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import ConnectWalletAlert from "components/common/ConnectWalletAlert"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import TokenCard from "components/dashboard/TokenCard"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { ChainSlugs } from "connectors"
import useMyTokens from "hooks/useMyTokens"
import { useEffect } from "react"
import { useAccount, useNetwork } from "wagmi"

const Page = (): JSX.Element => {
  const [{ data: networkData }] = useNetwork()
  const [{ data: accountData, loading: accountDataLoading }] = useAccount()

  const { openWalletSelectorModal } = useWeb3ConnectionManager()

  const { isValidating, data: tokens } = useMyTokens()

  useEffect(() => {
    if (accountData?.address || accountDataLoading) return
    openWalletSelectorModal()
  }, [accountData, accountDataLoading])

  return (
    <Layout title="Dashboard">
      {accountData?.address ? (
        <Section title="My tokens">
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={{ base: 4, md: 6 }}>
            {isValidating ? (
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
      ) : (
        <ConnectWalletAlert />
      )}
    </Layout>
  )
}

export default Page

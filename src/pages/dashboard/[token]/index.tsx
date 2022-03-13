import { Heading, HStack, Img, SimpleGrid, Spinner, Stack } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import AllocationCard from "components/dashboard/AllocationCard"
import useTokenDataFromIpfs from "components/dashboard/hooks/useTokenDataFromIPFS"
import { useRouter } from "next/router"
import { useToken } from "wagmi"

const Page = (): JSX.Element => {
  const router = useRouter()
  const tokenAddress = router.query.token?.toString()?.toLowerCase()

  const [{ data: tokenContractData, loading }] = useToken({ address: tokenAddress })
  const { data, isValidating } = useTokenDataFromIpfs(tokenAddress)

  return (
    <Layout title="Token page">
      {isValidating || loading ? (
        <Spinner />
      ) : (
        <Stack spacing={8}>
          <HStack spacing={4}>
            {data?.icon && (
              <Img
                src={`${process.env.NEXT_PUBLIC_FLEEK_BUCKET}/${tokenAddress}/${data?.icon}`}
                alt={`${tokenContractData?.symbol} icon`}
                boxSize={12}
              />
            )}
            <Heading as="h2" fontFamily="display">
              {tokenContractData?.symbol}
            </Heading>
          </HStack>

          {data?.airdrops?.length && (
            <Section title="Airdrops">
              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3 }}
                gap={{ base: 4, md: 6 }}
              >
                {data.airdrops.map((airdrop) => (
                  <AllocationCard
                    key={airdrop.prettyUrl}
                    fileName={`${tokenAddress}/${airdrop.fileName}`}
                  />
                ))}
              </SimpleGrid>
            </Section>
          )}

          {data?.vestings?.length && (
            <Section title="Vestings">
              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3 }}
                gap={{ base: 4, md: 6 }}
              >
                {data.vestings.map((vesting) => (
                  <AllocationCard
                    key={vesting.prettyUrl}
                    fileName={`${tokenAddress}/${vesting.fileName}`}
                  />
                ))}
              </SimpleGrid>
            </Section>
          )}
        </Stack>
      )}
    </Layout>
  )
}

export default Page

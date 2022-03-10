import { Heading, HStack, Img, SimpleGrid, Spinner, Stack } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import AllocationCard from "components/dashboard/AllocationCard"
import useTokenDataFromIpfs from "components/dashboard/hooks/useTokenDataFromIPFS"
import { useRouter } from "next/router"
import { useToken } from "wagmi"

const Page = (): JSX.Element => {
  const router = useRouter()
  const [{ data: tokenContractData, loading }] = useToken({
    address: router.query.token?.toString(),
  })
  const { data, isValidating } = useTokenDataFromIpfs(router.query.token?.toString())

  return (
    <Layout title="Token page">
      {isValidating || loading ? (
        <Spinner />
      ) : (
        <Stack spacing={8}>
          <HStack spacing={4}>
            {data?.icon && (
              <Img
                src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${data?.hash}/${data?.icon}`}
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
                {data.airdrops.map((vesting) => (
                  <AllocationCard
                    key={vesting}
                    ipfsHash={data.hash}
                    fileName={vesting}
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
                    key={vesting}
                    ipfsHash={data.hash}
                    fileName={vesting}
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

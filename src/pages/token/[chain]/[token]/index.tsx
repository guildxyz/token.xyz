import {
  Heading,
  HStack,
  Img,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react"
import Layout from "components/common/Layout"
import AllocationCard from "components/dashboard/AllocationCard"
import useTokenDataFromIpfs from "hooks/useTokenDataFromIPFS"
import { useRouter } from "next/router"
import { useToken } from "wagmi"

const Page = (): JSX.Element => {
  const router = useRouter()
  const chain = router.query.chain?.toString()
  const tokenAddress = router.query.token?.toString()?.toLowerCase()

  const [{ data: tokenContractData, loading }] = useToken({ address: tokenAddress })
  const { data, isValidating } = useTokenDataFromIpfs(chain, tokenAddress)

  return (
    <Layout
      title={
        loading || !tokenContractData ? "Token page" : tokenContractData?.symbol
      }
    >
      {isValidating || loading ? (
        <Spinner />
      ) : (
        <Stack spacing={8}>
          <HStack spacing={4}>
            {data?.icon && (
              <Img
                src={`${process.env.NEXT_PUBLIC_FLEEK_BUCKET}/${chain}/${tokenAddress}/${data?.icon}`}
                alt={`${tokenContractData?.symbol} icon`}
                boxSize={12}
                rounded="full"
              />
            )}
            <Heading
              as="h2"
              fontFamily="display"
              color="tokenxyz.red.500"
              textShadow="0 2px 0 var(--chakra-colors-tokenxyz-black)"
              letterSpacing="wider"
              fontSize={{ base: "2xl", sm: "4xl", md: "5xl" }}
            >
              {tokenContractData?.symbol}
            </Heading>
          </HStack>

          <Tabs colorScheme="tokenxyz.rosybrown">
            <TabList>
              <Tab>Airdrops</Tab>
              <Tab>Vestings</Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0} pt={8}>
                {data?.airdrops?.length ? (
                  <SimpleGrid
                    columns={{ base: 1, sm: 2, lg: 3 }}
                    gap={{ base: 4, md: 6 }}
                  >
                    {data.airdrops.map((airdrop) => (
                      <AllocationCard
                        key={airdrop.prettyUrl}
                        prettyUrl={airdrop.prettyUrl}
                        fileName={`${chain}/${tokenAddress}/${airdrop.fileName}`}
                      />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text>There are no airdrops for this token.</Text>
                )}
              </TabPanel>

              <TabPanel px={0} pt={8}>
                {data?.vestings?.length ? (
                  <SimpleGrid
                    columns={{ base: 1, sm: 2, lg: 3 }}
                    gap={{ base: 4, md: 6 }}
                  >
                    {data.vestings.map((vesting) => (
                      <AllocationCard
                        key={vesting.prettyUrl}
                        prettyUrl={vesting.prettyUrl}
                        fileName={`${chain}/${tokenAddress}/${vesting.fileName}`}
                      />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text>There are no vestings for this token.</Text>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      )}
    </Layout>
  )
}

export default Page

import {
  Heading,
  HStack,
  Img,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Allocation from "components/[token]/Allocation"
import useHash from "hooks/useHash"
import useTokenDataFromIpfs from "hooks/useTokenDataFromIPFS"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { useToken } from "wagmi"

const Page = (): JSX.Element => {
  const router = useRouter()

  const chain = router.query.chain?.toString()
  const tokenAddress = router.query.token?.toString()?.toLowerCase()

  const [hash, setHash] = useHash()

  const [{ data: tokenContractData, loading }] = useToken({ address: tokenAddress })
  const { data, isValidating } = useTokenDataFromIpfs(chain, tokenAddress)

  const allocations = useMemo(
    () =>
      data
        ? []
            ?.concat(data.airdrops)
            .concat(data.vestings)
            ?.filter((allocation) => !!allocation)
        : [],
    [data]
  )

  const currentIndex = useMemo(() => {
    const indexByHash = allocations?.findIndex(
      (allocation) => allocation.prettyUrl === hash?.replace("#", "")
    )

    return indexByHash > -1 ? indexByHash : 0
  }, [allocations, hash])

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

          <Tabs
            colorScheme="tokenxyz.rosybrown"
            index={currentIndex}
            onChange={(index) => setHash(`#${allocations?.[index]?.prettyUrl}`)}
          >
            <TabList borderBottomWidth={0}>
              {allocations?.map((allocation) => (
                <Tab
                  key={allocation.prettyUrl}
                  fontWeight="bold"
                  fontSize="xl"
                  fontFamily="display"
                  color="tokenxyz.blue.500"
                  textShadow="0 1px 0 var(--chakra-colors-tokenxyz-black)"
                  letterSpacing="wider"
                  _selected={{
                    color: "tokenxyz.blue.500",
                    borderBottomColor: "tokenxyz.blue.500",
                  }}
                >
                  {allocation.prettyUrl}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {allocations?.map((allocation) => (
                <TabPanel key={allocation.prettyUrl} px={0} pt={8}>
                  <Allocation allocationPrettyUrl={allocation.prettyUrl} />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Stack>
      )}
    </Layout>
  )
}

export default Page

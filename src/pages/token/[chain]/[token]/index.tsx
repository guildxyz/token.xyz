import {
  Heading,
  HStack,
  Icon,
  Img,
  Stack,
  Tab as ChakraTab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react"
import Layout from "components/common/Layout"
import AddAllocations from "components/[token]/AddAllocations"
import Allocation from "components/[token]/Allocation"
import { ChainSlugs, supportedChainIds, TOKEN_XYZ_CONTRACT } from "connectors"
import { Contract, providers } from "ethers"
import useHash from "hooks/useHash"
import useTokenData from "hooks/useTokenData"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { Plus } from "phosphor-react"
import { PropsWithChildren, useMemo } from "react"
import TokenXyzABI from "static/abis/TokenXyzABI.json"
import { SWRConfig } from "swr"
import { Rest, TokenData } from "types"
import { useAccount } from "wagmi"

const Tab = ({ children, ...rest }: PropsWithChildren<Rest>): JSX.Element => (
  <ChakraTab
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
    {...rest}
  >
    {children}
  </ChakraTab>
)

const TokenPage = (): JSX.Element => {
  const router = useRouter()

  const chain = router.query.chain?.toString()
  const tokenAddress = router.query.token?.toString()?.toLowerCase()

  const [hash, setHash] = useHash()

  const [{ data: accountData }] = useAccount()
  const { data } = useTokenData()

  const isOwner = useMemo(
    () =>
      accountData?.address &&
      accountData.address?.toLowerCase() === data?.owner?.toLowerCase(),
    [accountData, data]
  )

  const allocations = useMemo(
    () =>
      data?.infoJSON
        ? []
            ?.concat(data.infoJSON?.airdrops)
            .concat(data.infoJSON?.vestings)
            ?.filter((allocation) => !!allocation)
        : [],
    [data]
  )

  const currentIndex = useMemo(() => {
    if (!hash) return 0

    const indexByHash = allocations?.findIndex(
      (allocation) => allocation.prettyUrl === hash?.replace("#", "")
    )

    return indexByHash > -1 ? indexByHash : isOwner ? allocations?.length : 0
  }, [allocations, hash, isOwner])

  return (
    <Layout title={data?.name ? `${data?.name} ($${data?.symbol})` : "Token page"}>
      <Stack spacing={8}>
        <HStack spacing={4}>
          {data?.infoJSON?.icon && (
            <Img
              src={`${process.env.NEXT_PUBLIC_FLEEK_BUCKET}/${chain}/${tokenAddress}/${data.infoJSON.icon}`}
              alt={`${data?.symbol} icon`}
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
            {data?.name || "Token page"}
          </Heading>
        </HStack>

        <Tabs
          colorScheme="tokenxyz.rosybrown"
          index={currentIndex}
          onChange={(index) =>
            setHash(`#${allocations?.[index]?.prettyUrl ?? "new"}`)
          }
        >
          <TabList borderBottomWidth={0}>
            {allocations?.map((allocation) => (
              <Tab key={allocation.prettyUrl}>{allocation.prettyUrl}</Tab>
            ))}
            {isOwner && (
              <Tab>
                <HStack>
                  <Icon as={Plus} />
                  <Text>Add more</Text>
                </HStack>
              </Tab>
            )}
          </TabList>

          <TabPanels>
            {allocations?.map((allocation) => (
              <TabPanel key={allocation.prettyUrl} px={0} pt={8}>
                <Allocation allocationPrettyUrl={allocation.prettyUrl} />
              </TabPanel>
            ))}
            {isOwner && (
              <TabPanel px={0} pt={8}>
                <AddAllocations />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Stack>
    </Layout>
  )
}

type Props = {
  fallback: { string: TokenData }
}

const TokenPageWrapper = ({ fallback }: Props): JSX.Element => (
  <>
    <SWRConfig value={{ fallback }}>
      <TokenPage />
    </SWRConfig>
  </>
)

const getStaticProps: GetStaticProps = async ({ params }) => {
  const chainSlug = params.chain?.toString()
  const address = params.token?.toString()

  const endpoint = `/token/${chainSlug}/${address}`

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api"
      : process.env.NEXT_PUBLIC_API_URL

  const tokenData: TokenData = await fetch(`${baseUrl}${endpoint}`)
    .then((res) => res.json())
    .catch((_) => ({}))

  if (!tokenData?.symbol)
    return {
      notFound: true,
      revalidate: 10,
    }

  const fallback = {
    [endpoint]: tokenData,
  }

  if (
    tokenData?.infoJSON?.airdrops?.length ||
    tokenData?.infoJSON?.vestings?.length
  ) {
    const allocations: Array<{ fileName: string; prettyUrl: string }> = []
      ?.concat(tokenData?.infoJSON?.airdrops || [])
      ?.concat(tokenData?.infoJSON?.vestings || [])

    for (const allocation of allocations) {
      const url = `${process.env.NEXT_PUBLIC_FLEEK_BUCKET}/${chainSlug}/${address}/${allocation.fileName}`

      const allocationData = await fetch(url)
        .then((allocationJSON) => allocationJSON.json())
        .catch((_) => null)

      if (allocationData) fallback[url] = allocationData
    }
  }

  return {
    props: {
      fallback,
    },
    revalidate: 60,
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  let paths = []

  for (const chainId of supportedChainIds) {
    const provider = new providers.InfuraProvider(
      chainId,
      process.env.NEXT_PUBLIC_INFURA_ID
    )
    const tokenXyzContract = new Contract(
      TOKEN_XYZ_CONTRACT[chainId],
      TokenXyzABI,
      provider
    )

    const chainSlug = ChainSlugs[chainId]
    const tokenDeployedEvents = await tokenXyzContract.queryFilter(
      tokenXyzContract.filters.TokenDeployed(null)
    )
    const pathData: Array<{ params: { chain: string; token: string } }> =
      tokenDeployedEvents?.map((event) => ({
        params: { chain: chainSlug, token: event?.args?.[2] },
      }))
    paths = paths.concat(pathData)
  }

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticPaths, getStaticProps }
export default TokenPageWrapper

import {
  Heading,
  HStack,
  Img,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Allocation from "components/[token]/Allocation"
import { ChainSlugs, supportedChainIds, TOKEN_XYZ_CONTRACT } from "connectors"
import { Contract, providers } from "ethers"
import useHash from "hooks/useHash"
import useTokenData from "hooks/useTokenData"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { useMemo } from "react"
import TokenXyzABI from "static/abis/TokenXyzABI.json"
import { SWRConfig } from "swr"
import { TokenData } from "types"

const TokenPage = (): JSX.Element => {
  const router = useRouter()

  const chain = router.query.chain?.toString()
  const tokenAddress = router.query.token?.toString()?.toLowerCase()

  const [hash, setHash] = useHash()

  const { data } = useTokenData(chain, tokenAddress)

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
    const indexByHash = allocations?.findIndex(
      (allocation) => allocation.prettyUrl === hash?.replace("#", "")
    )

    return indexByHash > -1 ? indexByHash : 0
  }, [allocations, hash])

  return (
    <Layout
      title={
        !data?.name || !data?.symbol
          ? "Token page"
          : `${data.name} ($${data.symbol})`
      }
    >
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

  const data: TokenData = await fetch(`${baseUrl}${endpoint}`)
    .then((res) => res.json())
    .catch((_) => ({}))

  if (!data?.symbol)
    return {
      notFound: true,
      revalidate: 10,
    }

  return {
    props: {
      fallback: {
        [endpoint]: data,
      },
    },
    revalidate: 60,
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  let paths = []

  for (const chainId of supportedChainIds) {
    const provider = new providers.InfuraProvider(chainId)
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

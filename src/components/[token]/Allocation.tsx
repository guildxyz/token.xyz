import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import { ConfettiProvider } from "components/common/ConfettiContext"
import Airdrop from "components/[token]/components/Airdrop"
import BondVesting from "components/[token]/components/BondVesting"
import { AllocationProvider } from "components/[token]/components/common/AllocationContext"
import LinearVesting from "components/[token]/components/LinearVesting"
import { chains, ChainSlugs } from "connectors"
import useAllocationData from "hooks/useAllocationData"
import useToast from "hooks/useToast"
import useTokenData from "hooks/useTokenData"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { VestingTypes } from "types"
import { useAccount, useNetwork } from "wagmi"

type Props = {
  allocationPrettyUrl: string
}

const Allocation = ({ allocationPrettyUrl }: Props): JSX.Element => {
  const router = useRouter()
  const chain = router.query?.chain?.toString()
  const tokenAddress = router.query?.token?.toString()

  const [{ data: networkData }, switchNetwork] = useNetwork()
  const [{ data: accountData }] = useAccount()

  const { data: tokenData } = useTokenData()

  const vestingTypesComponents: Record<
    Exclude<VestingTypes, "DISTRIBUTE">,
    JSX.Element
  > = {
    NO_VESTING: <Airdrop />,
    LINEAR_VESTING: <LinearVesting />,
    BOND_VESTING: <BondVesting />,
  }

  const generateFilePath = (fileName: string) =>
    fileName ? `${chain}/${tokenAddress}/${fileName}` : null

  const { data, error } = useAllocationData(
    tokenData?.infoJSON
      ? generateFilePath(
          (tokenData.infoJSON.airdrops || [])
            .concat(tokenData.infoJSON.vestings || [])
            ?.find((allocation) => allocation.prettyUrl === allocationPrettyUrl)
            ?.fileName
        )
      : null
  )

  const allocationsChain = useMemo(
    () =>
      chains?.find((c) => c.id === ChainSlugs[router.query.chain?.toString()])?.name,
    [chains, router.query]
  )

  const shouldSwitchChain = useMemo(
    () => ChainSlugs[router.query.chain?.toString()] !== networkData?.chain?.id,
    [router.query, networkData]
  )

  const toast = useToast()
  const requestManualNetworkChange = (chainName: string) => () =>
    toast({
      title: "Your wallet doesn't support switching chains automatically",
      description: `Please switch to ${chainName} from your wallet manually!`,
      status: "error",
      duration: 4000,
    })

  return (
    <>
      {data?.vestingType ? (
        <ConfettiProvider>
          <AllocationProvider initialData={data}>
            <Stack spacing={8} alignItems="center">
              {shouldSwitchChain && accountData && (
                <Alert
                  status="error"
                  bgColor="tokenxyz.red.100"
                  color="tokenxyz.red.500"
                  borderColor="tokenxyz.red.500"
                  maxW="container.sm"
                >
                  <AlertIcon color="tokenxyz.red.500" />
                  <Stack
                    w="full"
                    direction={{ base: "column", md: "row" }}
                    spacing={4}
                    alignItems="end"
                  >
                    <Stack w="full">
                      <AlertTitle>Uh-oh!</AlertTitle>
                      <AlertDescription>
                        {`Please switch to ${allocationsChain} in order to interact with this ${
                          data?.vestingType === "NO_VESTING" ? "airdrop" : "vesting"
                        }!`}
                      </AlertDescription>
                    </Stack>

                    <Button
                      minW={44}
                      colorScheme="tokenxyz.red"
                      onClick={() =>
                        switchNetwork
                          ? switchNetwork(ChainSlugs[router.query.chain?.toString()])
                          : requestManualNetworkChange(allocationsChain)
                      }
                    >{`Switch to ${allocationsChain}`}</Button>
                  </Stack>
                </Alert>
              )}
              {vestingTypesComponents[data.vestingType]}
            </Stack>
          </AllocationProvider>
        </ConfettiProvider>
      ) : error ? (
        <Text>Could not load data.</Text>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default Allocation

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
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
import useTokenDataFromIpfs from "hooks/useTokenDataFromIPFS"
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

  const [{ data: networkData }] = useNetwork()
  const [{ data: accountData }] = useAccount()

  const { data: tokenInfo } = useTokenDataFromIpfs(chain, tokenAddress)

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
    tokenInfo
      ? generateFilePath(
          tokenInfo.airdrops
            .concat(tokenInfo.vestings)
            ?.find((allocation) => allocation.prettyUrl === allocationPrettyUrl)
            ?.fileName
        )
      : null
  )

  const shouldSwitchChain = useMemo(
    () => ChainSlugs[router.query.chain?.toString()] !== networkData?.chain?.id,
    [router.query, networkData]
  )

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
                  <Stack w="full">
                    <AlertTitle>Uh-oh!</AlertTitle>
                    <AlertDescription>
                      {`Please switch to ${
                        chains?.find(
                          (c) => c.id === ChainSlugs[router.query.chain?.toString()]
                        )?.name
                      } in order to interact with this ${
                        data?.vestingType === "NO_VESTING" ? "airdrop" : "vesting"
                      }!`}
                    </AlertDescription>
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

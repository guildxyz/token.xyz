import { Button, Flex, Heading, Skeleton, Stack, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import { ChainSlugs } from "connectors"
import { BigNumber, utils } from "ethers"
import useTokenData from "hooks/useTokenData"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import { Cohort as CohortType } from "types"
import { useAccount, useNetwork } from "wagmi"
import Countdown from "../../common/Countdown"
import useClaim from "../hooks/useClaim"
import useCohort from "../hooks/useCohort"

const formatAmount = (amount: BigNumber, decimals: number): string =>
  parseFloat(utils.formatUnits(amount ?? 0, decimals ?? 18)).toFixed(2)

type Props = {
  cohortIpfsData?: CohortType
}

const Cohort = ({ cohortIpfsData }: Props): JSX.Element => {
  const router = useRouter()
  const [{ data: networkData }] = useNetwork()
  const [{ data: accountData, error: accountError, loading: accountLoading }] =
    useAccount()

  const { name, merkleRoot, claims, distributionEnd } = cohortIpfsData || {}

  const {
    data: tokenData,
    error: tokenError,
    isValidating: tokenLoading,
  } = useTokenData()

  const {
    data: cohortData,
    isValidating: cohortDataLoading,
    mutate: mutateCohortData,
  } = useCohort(merkleRoot)

  const isEligible = useMemo(
    () =>
      !claims || !accountData
        ? false
        : Object.keys(claims)?.includes(accountData.address),
    [claims, accountData]
  )

  const vestingEnded = useMemo(
    () =>
      distributionEnd && distributionEnd < Math.round(new Date().getTime() / 1000),
    [distributionEnd]
  )

  const {
    onSubmit,
    isLoading: isClaimLoading,
    response: claimResponse,
  } = useClaim(merkleRoot)

  useEffect(() => {
    if (!claimResponse) return
    mutateCohortData()
  }, [claimResponse])

  const claimableNow = useMemo(
    () => formatAmount(cohortData?.claimableAmount, tokenData?.decimals),
    [tokenData, cohortData]
  )

  const alreadyClaimed = useMemo(
    () => formatAmount(cohortData?.claimed, tokenData?.decimals),
    [tokenData, cohortData]
  )

  const shouldSwitchChain = useMemo(
    () => ChainSlugs[router.query.chain?.toString()] !== networkData?.chain?.id,
    [router.query, networkData]
  )

  return (
    <Card
      mx="auto"
      px={{ base: 8, sm: 16 }}
      py={{ base: 6, sm: 12 }}
      w="full"
      maxW="container.sm"
    >
      <Flex alignItems="center" direction="column">
        <Stack mb={8} alignItems="center">
          <Heading
            as="h2"
            mb={2}
            fontFamily="display"
            color="tokenxyz.red.500"
            textShadow="0 2px 0 var(--chakra-colors-tokenxyz-black)"
            letterSpacing="wider"
            fontSize={{ base: "3xl", sm: "5xl", md: "6xl" }}
          >
            {name}
          </Heading>
          <Skeleton
            width="max-content"
            isLoaded={!tokenLoading && !!tokenData?.symbol}
          >
            <Text
              as="span"
              fontSize="md"
              fontWeight="medium"
              color="tokenxyz.rosybrown.500"
            >
              Claim your ${tokenData?.symbol}
            </Text>
          </Skeleton>
        </Stack>

        {vestingEnded ? (
          <Text colorScheme="gray" textAlign="center">
            Sorry, this vesting has ended!
          </Text>
        ) : (
          <>
            <Stack mb={8}>
              <Countdown expiryTimestamp={distributionEnd * 1000} />
            </Stack>

            <Stack mb={8} alignItems="start">
              <Text colorScheme="gray" textAlign="center">
                {`Total claimable amount: ${formatAmount(
                  BigNumber.from(claims?.[accountData?.address]?.amount || "0"),
                  tokenData?.decimals
                )}`}
              </Text>
              <Text colorScheme="gray" textAlign="center">
                {`Claimable now: ${claimableNow}`}
              </Text>
              <Text colorScheme="gray" textAlign="center">
                {`Already claimed: ${alreadyClaimed}`}
              </Text>
            </Stack>
          </>
        )}

        <Button
          colorScheme={shouldSwitchChain ? "tokenxyz.red" : "tokenxyz.rosybrown"}
          isDisabled={
            vestingEnded ||
            !isEligible ||
            parseFloat(
              formatAmount(cohortData?.claimableAmount, tokenData?.decimals)
            ) < 0.01
          }
          isLoading={cohortDataLoading || accountLoading || isClaimLoading}
          loadingText={isClaimLoading ? "Claiming tokens" : "Loading"}
          mt="auto"
          maxW="max-content"
          onClick={onSubmit}
        >
          {vestingEnded
            ? "Ended"
            : !accountData?.address
            ? "Connect your wallet"
            : shouldSwitchChain
            ? "Wrong chain"
            : !isEligible
            ? "You aren't eligible"
            : "Claim my tokens"}
        </Button>
      </Flex>
    </Card>
  )
}

export default Cohort

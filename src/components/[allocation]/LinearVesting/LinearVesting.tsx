import { Button, Flex, Heading, Skeleton, Stack, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import { BigNumber, utils } from "ethers"
import { useMemo } from "react"
import { useAccount, useToken } from "wagmi"
import { useAllocation } from "../common/AllocationContext"
import Countdown from "../common/Countdown"
import useClaim from "./hooks/useClaim"
import useCohort from "./hooks/useCohort"

const formatAmount = (amount: BigNumber, decimals: number): string =>
  parseFloat(utils.formatUnits(amount ?? 0, decimals ?? 18)).toFixed(2)

const LinearVesting = (): JSX.Element => {
  const { name, tokenAddress, claims, distributionEnd } = useAllocation()
  const [{ data: tokenData, error: tokenError, loading: tokenLoading }] = useToken({
    address: tokenAddress,
  })

  const { data: cohortData } = useCohort()

  const [{ data: accountData, error: accountError, loading: accountLoading }] =
    useAccount()

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

  const { onSubmit, isLoading: isClaimLoading } = useClaim()

  return (
    <Card
      mx="auto"
      px={{ base: 8, sm: 16 }}
      py={{ base: 6, sm: 12 }}
      maxW="container.sm"
    >
      <Flex alignItems="center" direction="column" minH="60vh">
        <Stack mb={8} alignItems="center">
          <Heading as="h2" mb={2} fontFamily="display">
            {name}
          </Heading>
          <Skeleton width="max-content" isLoaded={!tokenLoading}>
            <Text as="span" fontSize="lg" fontWeight="medium" colorScheme="gray">
              Claim your ${tokenData?.symbol || "TOKENSYMBOL"}
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
                {`Claimable now: ${formatAmount(
                  cohortData?.claimableAmount,
                  tokenData?.decimals
                )}`}
              </Text>
              <Text colorScheme="gray" textAlign="center">
                {`Already claimed: ${formatAmount(
                  cohortData?.claimed,
                  tokenData?.decimals
                )}`}
              </Text>
            </Stack>
          </>
        )}

        <Button
          colorScheme="primary"
          isDisabled={vestingEnded || /* isClaimed || */ !isEligible}
          isLoading={isClaimLoading}
          loadingText="Claiming tokens"
          mt="auto"
          maxW="max-content"
          onClick={onSubmit}
        >
          Claim my tokens
        </Button>
      </Flex>
    </Card>
  )
}

export default LinearVesting

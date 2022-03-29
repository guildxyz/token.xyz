import { Button, Flex, Heading, Skeleton, Stack, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import { useEffect, useMemo } from "react"
import { useAccount, useToken } from "wagmi"
import { useAllocation } from "../common/AllocationContext"
import Countdown from "../common/Countdown"
import useAirdropDataWithIndex from "./hooks/useAirdropDataWithIndex"
import useClaim from "./hooks/useClaim"

const Airdrop = (): JSX.Element => {
  const { name, tokenAddress, claims, distributionEnd } = useAllocation()
  const [{ data: tokenData, error: tokenError, loading: tokenLoading }] = useToken({
    address: tokenAddress,
  })

  const [{ data: accountData, error: accountError, loading: accountLoading }] =
    useAccount()

  const isEligible = useMemo(
    () =>
      !claims || !accountData
        ? false
        : Object.keys(claims)?.includes(accountData.address),
    [claims, accountData]
  )

  const airdropEnded = useMemo(
    () =>
      distributionEnd && distributionEnd < Math.round(new Date().getTime() / 1000),
    [distributionEnd]
  )

  const {
    data: { isClaimed, owner },
    error: airdropDataWithIndexError,
    isValidating: isAirdropDataWithIndexLoading,
    mutate: mutateAirdropData,
  } = useAirdropDataWithIndex()

  const { onSubmit, isLoading: isClaimLoading, response: claimResponse } = useClaim()

  useEffect(() => {
    if (!claimResponse) return
    mutateAirdropData()
  }, [claimResponse])

  return (
    <Card
      mx="auto"
      px={{ base: 8, sm: 16 }}
      py={{ base: 6, sm: 12 }}
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
          <Skeleton width="max-content" isLoaded={!tokenLoading}>
            <Text
              as="span"
              fontSize="md"
              fontWeight="medium"
              color="tokenxyz.rosybrown.500"
            >
              Claim your ${tokenData?.symbol || "TOKENSYMBOL"}
            </Text>
          </Skeleton>
        </Stack>

        {airdropEnded ? (
          <Text colorScheme="gray" textAlign="center">
            Sorry, this airdrop has ended!
          </Text>
        ) : (
          <>
            <Stack mb={8}>
              <Countdown expiryTimestamp={distributionEnd * 1000} />
            </Stack>

            <Stack mb={8}>
              <Text colorScheme="gray" textAlign="center">
                This is the airdrop's description. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Vivamus et bibendum massa, eu porta
                sapien. Pellentesque leo ex, interdum vel ultrices sit amet,
                tincidunt sed nisl.
              </Text>
            </Stack>
          </>
        )}

        <Button
          colorScheme="tokenxyz.rosybrown"
          isDisabled={airdropEnded || isClaimed || !isEligible}
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

export default Airdrop
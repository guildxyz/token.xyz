import { Tag, Text, VStack } from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"
import shortenHex from "utils/shortenHex"
import { useAccount } from "wagmi"

const TokenIssuancePreview = (): JSX.Element => {
  const [{ data: accountData }] = useAccount()
  const { control } = useFormContext()

  const tokenTicker = useWatch({ control, name: "tokenTicker" })
  const initialSupply = useWatch({ control, name: "initialSupply" })
  const transferOwnershipTo = useWatch({ control, name: "transferOwnershipTo" })
  const chain = useWatch({ control, name: "chain" })

  if (!tokenTicker && !initialSupply) return null

  return (
    <VStack alignItems="start" spacing={1} fontSize="sm">
      <Text as="span" fontWeight="bold">
        {tokenTicker ? `$${tokenTicker}` : "No ticker"}
      </Text>
      <Tag size="sm">
        Supply: {!isNaN(initialSupply) && Number(initialSupply).toLocaleString("en")}
      </Tag>
      <Tag size="sm">
        Owner: {shortenHex(transferOwnershipTo || accountData?.address, 3)}
      </Tag>
      <Tag size="sm">Chain: {chain}</Tag>
    </VStack>
  )
}

export default TokenIssuancePreview

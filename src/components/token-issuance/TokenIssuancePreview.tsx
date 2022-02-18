import { Text, VStack } from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"

const TokenIssuancePreview = (): JSX.Element => {
  const { control } = useFormContext()

  const tokenTicker = useWatch({ control, name: "tokenTicker" })
  const initialSupply = useWatch({ control, name: "initialSupply" })

  if (!tokenTicker && !initialSupply) return null

  return (
    <VStack alignItems="start" spacing={0.5} fontSize="sm">
      <Text as="span" fontWeight="bold">
        {tokenTicker ? `$${tokenTicker}` : "No ticker"}
      </Text>
      <Text as="span" color="gray">
        Initial supply: {Number(initialSupply).toLocaleString("en")}
      </Text>
    </VStack>
  )
}

export default TokenIssuancePreview

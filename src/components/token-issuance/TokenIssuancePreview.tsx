import { Text, VStack } from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"

const TokenIssuancePreview = (): JSX.Element => {
  const { control } = useFormContext()

  const tokenTicker = useWatch({ control, name: "tokenTicker" })
  const initialSupply = useWatch({ control, name: "initialSupply" })

  if (!tokenTicker && !initialSupply) return null

  return (
    <VStack alignItems="start" spacing={0.5}>
      <Text as="span" fontWeight="bold">
        {tokenTicker ? `$${tokenTicker}` : "No ticker"}
      </Text>
      <Text as="span" color="gray" fontSize="sm">
        Supply: {Number(initialSupply).toLocaleString("en")}
      </Text>
    </VStack>
  )
}

export default TokenIssuancePreview

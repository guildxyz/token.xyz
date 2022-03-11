import {
  Box,
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Tr,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import shortenHex from "utils/shortenHex"
import { useAccount } from "wagmi"

const GeneralTokenData = (): JSX.Element => {
  const borderColor = useColorModeValue("gray.200", undefined)

  const [{ data: accountData }] = useAccount()
  const { control } = useFormContext<TokenIssuanceFormType>()

  const tokenName = useWatch({ control, name: "tokenName" })
  const tokenTicker = useWatch({ control, name: "tokenTicker" })
  const initialSupply = useWatch({ control, name: "initialSupply" })
  const transferOwnershipTo = useWatch({ control, name: "transferOwnershipTo" })
  const chain = useWatch({ control, name: "chain" })

  const displayedAddress = useBreakpointValue({
    base: shortenHex(transferOwnershipTo || accountData?.address, 3),
    md: transferOwnershipTo || accountData?.address,
  })

  return (
    <Stack>
      <Heading as="h3" mb={2} fontFamily="display" fontSize="lg">
        General token data
      </Heading>
      <Box borderWidth={1} borderRadius="xl" overflow="hidden">
        <Table variant="simple" size="sm">
          <Tbody>
            <Tr>
              <Td borderColor={borderColor} fontWeight="bold">
                Name
              </Td>
              <Td borderColor={borderColor}>{tokenName}</Td>
            </Tr>
            <Tr>
              <Td borderColor={borderColor} fontWeight="bold">
                Symbol
              </Td>
              <Td borderColor={borderColor}>${tokenTicker}</Td>
            </Tr>
            <Tr>
              <Td borderColor={borderColor} fontWeight="bold">
                Supply
              </Td>
              <Td borderColor={borderColor}>
                {!isNaN(initialSupply) && Number(initialSupply).toLocaleString("en")}
              </Td>
            </Tr>
            <Tr>
              <Td borderColor={borderColor} fontWeight="bold">
                Owner address
              </Td>
              <Td borderColor={borderColor}>{displayedAddress}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold" borderBottom="none">
                Chain
              </Td>
              <Td borderBottom="none">{chain}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Stack>
  )
}

export default GeneralTokenData

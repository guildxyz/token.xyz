import {
  Box,
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import shortenHex from "utils/shortenHex"
import { useAccount } from "wagmi"

const GeneralTokenData = (): JSX.Element => {
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
              <Td fontWeight="bold">Name</Td>
              <Td>{tokenName}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Symbol</Td>
              <Td>${tokenTicker}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Supply</Td>
              <Td>
                {!isNaN(initialSupply) && Number(initialSupply).toLocaleString("en")}
              </Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold">Owner address</Td>
              <Td>{displayedAddress}</Td>
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

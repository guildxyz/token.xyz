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
import { chains } from "connectors"
import { useMemo } from "react"
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

  const chainName = useMemo(
    () => (chain && chains ? chains.find((c) => c.id === chain)?.name : ""),
    [chains, chain]
  )

  const displayedAddress = useBreakpointValue({
    base: shortenHex(transferOwnershipTo || accountData?.address, 3),
    md: transferOwnershipTo || accountData?.address,
  })

  return (
    <Stack>
      <Heading as="h3" mb={2} color="tokenxyz.blue.500" fontSize="xl">
        General token data
      </Heading>
      <Box
        borderWidth={1}
        borderColor="tokenxyz.rosybrown.500"
        overflow="hidden"
        borderRadius="xl"
      >
        <Table variant="simple" size="sm" bgColor="tokenxyz.white">
          <Tbody>
            <Tr>
              <Td borderColor="tokenxyz.rosybrown.500" fontWeight="bold">
                Name
              </Td>
              <Td borderColor="tokenxyz.rosybrown.500">{tokenName}</Td>
            </Tr>
            <Tr>
              <Td borderColor="tokenxyz.rosybrown.500" fontWeight="bold">
                Symbol
              </Td>
              <Td borderColor="tokenxyz.rosybrown.500">${tokenTicker}</Td>
            </Tr>
            <Tr>
              <Td borderColor="tokenxyz.rosybrown.500" fontWeight="bold">
                Supply
              </Td>
              <Td borderColor="tokenxyz.rosybrown.500">
                {!isNaN(initialSupply) && Number(initialSupply).toLocaleString("en")}
              </Td>
            </Tr>
            <Tr>
              <Td borderColor="tokenxyz.rosybrown.500" fontWeight="bold">
                Owner address
              </Td>
              <Td borderColor="tokenxyz.rosybrown.500">{displayedAddress}</Td>
            </Tr>
            <Tr>
              <Td fontWeight="bold" borderBottom="none">
                Chain
              </Td>
              <Td borderBottom="none">{chainName}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Stack>
  )
}

export default GeneralTokenData

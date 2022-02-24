import {
  Box,
  Button,
  Heading,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import Modal from "components/common/Modal"
import Chart from "components/token-issuance/DistributionForm/components/Chart"
import { useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { FixedSizeList } from "react-window"
import { TokenIssuanceFormType } from "types"
import shortenHex from "utils/shortenHex"

const DistributionData = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { control } = useFormContext<TokenIssuanceFormType>()
  const distributionData = useWatch({ control, name: "distributionData" })

  const addressList = useMemo(
    () =>
      distributionData
        ?.map((allocationData) => allocationData.allocationAddressesAmounts)
        ?.reduce((arr1, arr2) => arr1.concat(arr2), [])
        ?.filter((item) => !!item),
    [distributionData]
  )

  const shouldShortenAddresses = useBreakpointValue({ base: true, md: false })

  const Row = ({ index, style }) => (
    <HStack style={style}>
      <pre>
        {shouldShortenAddresses
          ? shortenHex(addressList[index]?.address, 4)
          : addressList[index]?.address}
      </pre>
      <Text as="span" w="full" textAlign="right">
        {addressList[index]?.amount}
      </Text>
    </HStack>
  )

  return (
    <>
      <SimpleGrid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
        <Stack>
          <Heading as="h3" mb={2} fontFamily="display" fontSize="lg">
            Distribution data
          </Heading>
          {addressList?.length ? (
            <>
              <Box borderWidth={1} borderRadius="xl" overflow="hidden">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Address</Th>
                      <Th isNumeric>Amount</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {addressList.slice(0, 3).map((row) => (
                      <Tr key={`${row.address}-${row.amount}`}>
                        <Td>{shortenHex(row.address, 3)}</Td>
                        <Td isNumeric>{row.amount}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <Button size="sm" w="full" onClick={onOpen}>
                View all addresses
              </Button>
            </>
          ) : (
            <Text>No distribution data</Text>
          )}
        </Stack>

        <Stack maxW="full">
          <Heading as="h3" mb={2} fontFamily="display" fontSize="lg">
            Distribution chart
          </Heading>
          <Chart />
        </Stack>
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Eligible addresses</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {addressList?.length && (
              <>
                <HStack
                  mb={1}
                  fontWeight="bold"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  textColor="gray"
                  fontSize="sm"
                >
                  <Text as="span">Address</Text>
                  <Text as="span" w="full" textAlign="right">
                    Amount
                  </Text>
                </HStack>
                <Box
                  sx={{
                    "> div": { width: "100%", overflow: "hidden auto !important" },
                  }}
                >
                  <FixedSizeList
                    height={350}
                    itemCount={addressList.length}
                    itemSize={32}
                    className="custom-scrollbar"
                  >
                    {Row}
                  </FixedSizeList>
                </Box>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DistributionData

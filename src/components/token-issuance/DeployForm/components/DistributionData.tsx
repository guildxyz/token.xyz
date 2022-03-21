import {
  Box,
  Button,
  GridItem,
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
  useColorModeValue,
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
  const borderColor = useColorModeValue("gray.200", undefined)

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

  return (
    <>
      <SimpleGrid columns={2} gap={4}>
        <GridItem colSpan={{ base: 2, sm: 1 }}>
          <Stack>
            <Heading as="h3" mb={2} fontFamily="display" fontSize="lg">
              Distribution data
            </Heading>
            {addressList?.length ? (
              <>
                <Box
                  borderColor={borderColor}
                  borderWidth={1}
                  borderRadius="xl"
                  overflow="hidden"
                >
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Address</Th>
                        <Th isNumeric>Amount</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {addressList.slice(0, 3).map((row, i) => (
                        <Tr key={`${row.address}-${row.amount}`}>
                          <Td
                            borderBottom={i === 2 ? "none" : undefined}
                            borderColor={borderColor}
                          >
                            {shortenHex(row.address, 3)}
                          </Td>
                          <Td
                            borderBottom={i === 2 ? "none" : undefined}
                            isNumeric
                            borderColor={borderColor}
                          >
                            {row.amount}
                          </Td>
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
        </GridItem>

        <GridItem colSpan={{ base: 2, sm: 1 }}>
          <Stack minW={0} maxW="full">
            <Heading as="h3" mb={2} fontFamily="display" fontSize="lg">
              Distribution chart
            </Heading>
            <Chart isSimple />
          </Stack>
        </GridItem>
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`${addressList?.length} eligible addresses`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {addressList?.length && (
              <Stack spacing={8}>
                {distributionData?.map((allocation) => {
                  const Row = ({ index, style }) => (
                    <HStack style={style}>
                      <pre>
                        {shouldShortenAddresses
                          ? shortenHex(
                              allocation?.allocationAddressesAmounts?.[index]
                                ?.address,
                              4
                            )
                          : allocation?.allocationAddressesAmounts?.[index]?.address}
                      </pre>
                      <Text as="span" w="full" textAlign="right">
                        {allocation?.allocationAddressesAmounts?.[index]?.amount}
                      </Text>
                    </HStack>
                  )

                  return (
                    <Stack key={allocation.allocationName}>
                      <Heading as="h3" fontSize="md">
                        {allocation.allocationName}
                      </Heading>
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
                          "> div": {
                            width: "100%",
                            overflow: "hidden auto !important",
                          },
                        }}
                      >
                        <FixedSizeList
                          height={Math.min(
                            allocation?.allocationAddressesAmounts?.length * 32,
                            160
                          )}
                          itemCount={allocation?.allocationAddressesAmounts?.length}
                          itemSize={32}
                          className="custom-scrollbar"
                        >
                          {Row}
                        </FixedSizeList>
                      </Box>
                    </Stack>
                  )
                })}
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DistributionData

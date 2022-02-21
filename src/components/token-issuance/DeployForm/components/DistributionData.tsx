import {
  Box,
  Button,
  Heading,
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
  useDisclosure,
} from "@chakra-ui/react"
import Modal from "components/common/Modal"
import Chart from "components/token-issuance/DistributionForm/components/Chart"
import { useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import shortenHex from "utils/shortenHex"

const DistributionData = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { control } = useFormContext()
  const distributionData = useWatch({ control, name: "distributionData" })

  const addressList = useMemo(
    () =>
      distributionData
        ?.map((allocationData) => allocationData.allocationAddressesAmounts)
        ?.reduce((arr1, arr2) => arr1.concat(arr2), [])
        ?.filter((item) => !!item),
    [distributionData]
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
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>Address</Th>
                  <Th isNumeric>Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {addressList?.map((row) => (
                  <Tr key={`${row.address}-${row.amount}`}>
                    <Td>
                      <pre>{row.address}</pre>
                    </Td>
                    <Td isNumeric>{row.amount}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DistributionData

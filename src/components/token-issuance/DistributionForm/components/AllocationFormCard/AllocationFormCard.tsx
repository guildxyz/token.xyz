import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react"
import { parse } from "papaparse"
import { TrashSimple } from "phosphor-react"
import { useRef, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import FormCard from "../FormCard"
import VestingTypePicker from "./components/VestingTypePicker"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

type Props = {
  index: number
  field: Record<string, any> // TODO: better types
  onRemove?: () => void
}

const AllocationFormCard = ({ index, field, onRemove }: Props): JSX.Element => {
  const fileInputRef = useRef(null)

  const {
    control,
    register,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<TokenIssuanceFormType>()

  const allocationAddressesAmounts = useWatch({
    name: `distributionData.${index}.allocationAddressesAmounts`,
    control,
  })

  const onUploadClick = () => {
    if (!fileInputRef?.current) return
    fileInputRef.current.click()
  }

  const [isParseLoading, setIsParseLoading] = useState(false)

  const onFileInputChange = (e) => {
    const file = e.target?.files?.[0]
    if (!file) return

    setIsParseLoading(true)
    parse(file, {
      complete: (results) => {
        clearErrors(`distributionData.${index}.allocationCsv`)
        setIsParseLoading(false)
        if (results.errors.length) {
          setError(`distributionData.${index}.allocationCsv`, {
            message: "Could not parse CSV",
            type: "validate",
          })
          return
        }

        // If we could parse the CSV, check if the data is actually valid
        if (
          !results.data.every(
            ([address, amount]) =>
              ADDRESS_REGEX.test(address) && typeof parseInt(amount) === "number"
          )
        ) {
          setError(`distributionData.${index}.allocationCsv`, {
            message: "Invalid data in CSV",
            type: "validate",
          })
          return
        }

        setValue(
          `distributionData.${index}.allocationAddressesAmounts`,
          results.data.map(([address, amount]) => ({ address, amount }))
        )
      },
    })
  }

  const onRemoveCsv = (e) => {
    if (!fileInputRef?.current) return
    fileInputRef.current.value = null
    setValue(`distributionData.${index}.allocationAddressesAmounts`, null)
    clearErrors(`distributionData.${index}.allocationCsv`)
  }

  return (
    <FormCard onRemove={onRemove}>
      <Stack spacing={4}>
        <FormControl
          isRequired
          isInvalid={!!errors?.distributionData?.[index]?.allocationName}
          w="full"
        >
          <FormLabel>Distribution group name</FormLabel>
          <Input
            {...register(`distributionData.${index}.allocationName`, {
              required: "This field is required!",
            })}
            placeholder="Choose a name for your group"
          />
          <FormErrorMessage>
            {errors?.distributionData?.[index]?.allocationName?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          isRequired
          position="relative"
          isInvalid={!!errors?.distributionData?.[index]?.allocationCsv}
        >
          <FormLabel mb={1}>Allocation list</FormLabel>
          <Text mb={2} colorScheme="gray" fontSize="sm">
            Upload the participant's addresses with their corresponding allocation
            sizes in a CSV file.
          </Text>
          <HStack>
            <Button
              colorScheme="primary"
              w="full"
              h={10}
              onClick={onUploadClick}
              isLoading={isParseLoading}
              isDisabled={allocationAddressesAmounts?.length > 0 || isParseLoading}
            >
              {allocationAddressesAmounts?.length
                ? `${allocationAddressesAmounts.length} addresses`
                : "Upload .csv"}
            </Button>

            {allocationAddressesAmounts?.length && (
              <IconButton
                aria-label="Remove .csv"
                icon={<Icon as={TrashSimple} />}
                colorScheme="red"
                onClick={onRemoveCsv}
                w={10}
                h={10}
              />
            )}
          </HStack>

          <Input
            ref={fileInputRef}
            type="file"
            display="none"
            position="absolute"
            top={0}
            left={0}
            accept=".csv"
            onChange={onFileInputChange}
          />
          <FormErrorMessage>
            {errors?.distributionData?.[index]?.allocationCsv?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Vesting</FormLabel>
          <VestingTypePicker index={index} />
          <FormErrorMessage>
            {errors?.distributionData?.[index]?.vestingType?.message}
          </FormErrorMessage>
        </FormControl>

        <Tag w="max-content">
          Estimated gas cost:
          <Text as="b" ml={1}>
            0.44 ETH
          </Text>
        </Tag>
      </Stack>
    </FormCard>
  )
}

export default AllocationFormCard

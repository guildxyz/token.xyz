import {
  Button,
  FormControl,
  FormErrorMessage,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Input,
  SimpleGrid,
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
    <FormCard title="Allocation" onRemove={onRemove}>
      <SimpleGrid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
        <FormControl
          isInvalid={!!errors?.distributionData?.[index]?.allocationName}
          w="full"
        >
          <Input
            {...register(`distributionData.${index}.allocationName`, {
              required: "This field is required!",
            })}
            placeholder="Name"
          />
          <FormErrorMessage>
            {errors?.distributionData?.[index]?.allocationName?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          position="relative"
          isInvalid={!!errors?.distributionData?.[index]?.allocationCsv}
        >
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

        <GridItem colSpan={2}>
          <VestingTypePicker index={index} />
        </GridItem>

        <GridItem colSpan={2}>
          <Tag>
            Estimated gas cost:
            <Text as="b" ml={1}>
              0.44 ETH
            </Text>
          </Tag>
        </GridItem>
      </SimpleGrid>
    </FormCard>
  )
}

export default AllocationFormCard

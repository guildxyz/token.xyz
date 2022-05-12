import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Spinner,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react"
import { NULL_ADDRESS } from "connectors"
import { utils } from "ethers"
import useTokenData from "hooks/useTokenData"
import { parse } from "papaparse"
import { TrashSimple } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import unique from "utils/unique"
import { erc20ABI, useAccount, useContract, useProvider } from "wagmi"
import FormCard from "../FormCard"
import VestingTypePicker from "./components/VestingTypePicker"
import useEstimateGas from "./hooks/useEstimateGas"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

type Props = {
  index: number
  onRemove?: () => void
}

const AllocationFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const [{ data: accountData }] = useAccount()
  const { data: tokenData } = useTokenData()
  const provider = useProvider()
  const tokenContract = useContract({
    addressOrName: tokenData?.address ?? NULL_ADDRESS,
    signerOrProvider: provider,
    contractInterface: erc20ABI,
  })

  const fileInputRef = useRef(null)

  const {
    control,
    register,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<TokenIssuanceFormType>()

  const initialSupply = useWatch({ name: "initialSupply", control })
  const [ownerBalance, setOwnerBalance] = useState(0)
  useEffect(() => {
    if (!tokenContract || !accountData?.address || !tokenData?.decimals) return
    ;(async () => {
      const balance = await tokenContract
        .balanceOf(accountData.address)
        .catch((_) => 0)

      setOwnerBalance(
        parseFloat(utils.formatUnits(balance.toString(), tokenData.decimals))
      )
    })()
  }, [accountData, tokenData])

  const distributionData = useWatch({ name: "distributionData", control })
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
      skipEmptyLines: true,
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

        const hasHeader =
          !ADDRESS_REGEX.test(results.data?.[0]?.[0]?.toString()) &&
          isNaN(parseInt(results.data?.[0]?.[1]?.toString()))

        // Data cleanup
        const data = results.data
          ?.slice(hasHeader ? 1 : 0)
          ?.map(([address, amount]) => [
            address?.trim(),
            parseFloat(
              amount?.toString()?.replaceAll(",", "")?.trim() || 0
            )?.toString(),
          ])

        // If we could parse the CSV, check if the data is actually valid
        if (
          !data.every(
            ([address, amount]) =>
              ADDRESS_REGEX.test(address) && typeof parseFloat(amount) === "number"
          )
        ) {
          setError(`distributionData.${index}.allocationCsv`, {
            message: "Invalid data in CSV",
            type: "validate",
          })
          return
        } else if (!data.map(([address]) => address?.toLowerCase()).every(unique)) {
          setError(`distributionData.${index}.allocationCsv`, {
            message: "The CSV contains duplicate addresses",
            type: "validate",
          })
          return
        }

        const mappedData = data.map(([address, amount]) => ({
          address,
          amount,
        }))

        /**
         * TODO: maybe extract this into a function, and call that function when the
         * vesting type changes too!
         */
        const filteredAllocations = distributionData
          ?.filter((_, i) => i !== index)
          ?.filter(
            (alloc) => alloc.vestingType === distributionData?.[index]?.vestingType
          )
          ?.map((alloc) => alloc.allocationAddressesAmounts)
          ?.filter((alloc) => !!alloc)
          ?.filter((alloc) => alloc.length === results?.data?.length)

        // Check if the uploaded CSVs are actually different CSV files
        for (const addressesAmountsArray of filteredAllocations) {
          if (
            !addressesAmountsArray?.some(
              ({ address, amount }, i) =>
                address?.toLowerCase() !== mappedData?.[i]?.address?.toLowerCase() &&
                amount !== mappedData?.[i]?.amount
            )
          ) {
            setError(`distributionData.${index}.allocationCsv`, {
              message:
                "You can't upload the same list to multiple vestings or airdrops",
              type: "validate",
            })
            return
          }
        }
        // Sum the amount in every allocation CSV. If it's greater than the token supply, show an error message to the user
        const otherAllocations = distributionData
          ?.map((allocation) => allocation.allocationAddressesAmounts)
          ?.reduce((arr1, arr2) => arr1.concat(arr2), [])
        const fullArray = mappedData.concat(otherAllocations)

        const sum = fullArray
          ?.filter((item) => !!item)
          ?.map((item) => parseFloat(item.amount))
          ?.reduce((amount1, amount2) => amount1 + amount2, 0)

        if (sum > (initialSupply ?? ownerBalance)) {
          setError(`distributionData.${index}.allocationCsv`, {
            message:
              "You're trying to allocate more tokens than the available supply!",
            type: "validate",
          })
          return
        }

        setValue(`distributionData.${index}.allocationAddressesAmounts`, mappedData)
      },
    })
  }

  const onRemoveCsv = () => {
    if (!fileInputRef?.current) return
    fileInputRef.current.value = null
    setValue(`distributionData.${index}.allocationAddressesAmounts`, null)
    clearErrors(`distributionData.${index}.allocationCsv`)
  }

  const { estimatedFee, loading, error } = useEstimateGas(index)

  return (
    <FormCard onRemove={onRemove}>
      <Stack spacing={4} color="tokenxyz.rosybrown.500">
        <FormControl
          isRequired
          isInvalid={!!errors?.distributionData?.[index]?.allocationName}
          w="full"
        >
          <FormLabel>Distribution group name</FormLabel>
          <Input
            {...register(`distributionData.${index}.allocationName`, {
              required: "This field is required!",
              validate: (value) =>
                !getValues("distributionData")
                  ?.filter((_, i) => i !== index)
                  ?.map((form) => form.allocationName?.toLowerCase())
                  ?.includes(value?.toLowerCase()) ||
                "Every airdrop/vesting name must be unique",
            })}
            placeholder="Choose a name for your group"
          />
          <FormErrorMessage color="tokenxyz.red.500">
            {errors?.distributionData?.[index]?.allocationName?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          isRequired
          position="relative"
          isInvalid={!!errors?.distributionData?.[index]?.allocationCsv}
        >
          <FormLabel mb={1}>Allocation list</FormLabel>
          <Text mb={2} color="tokenxyz.black" fontSize="sm">
            Upload the participant's addresses with their corresponding allocation
            sizes in a CSV file.
          </Text>
          <HStack>
            <Button
              colorScheme="tokenxyz.rosybrown"
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
                isRound
                icon={<Icon as={TrashSimple} />}
                colorScheme="tokenxyz.red"
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
          <FormErrorMessage color="tokenxyz.red.500">
            {errors?.distributionData?.[index]?.allocationCsv?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Vesting</FormLabel>
          <VestingTypePicker index={index} />
          <FormErrorMessage color="tokenxyz.red.500">
            {errors?.distributionData?.[index]?.vestingType?.message}
          </FormErrorMessage>
        </FormControl>

        <Tag w="max-content" bgColor="tokenxyz.rosybrown.500" color="tokenxyz.white">
          <HStack spacing={1}>
            {loading && <Spinner size="xs" />}
            <Text as="span">
              {loading ? (
                "Estimating gas fee"
              ) : error ? (
                "Could not estimate gas fee"
              ) : (
                <>
                  {`Estimated gas cost: `}
                  <Text as="b">{`${estimatedFee} ETH`}</Text>
                </>
              )}
            </Text>
          </HStack>
        </Tag>
      </Stack>
    </FormCard>
  )
}

export default AllocationFormCard

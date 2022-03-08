import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  InputGroup,
  InputRightAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Tooltip,
} from "@chakra-ui/react"
import { Question } from "phosphor-react"
import { Controller, useFormContext } from "react-hook-form"
import { TokenIssuanceFormType } from "types"

type Props = {
  index: number
}

const LinearVestingForm = ({ index }: Props): JSX.Element => {
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<TokenIssuanceFormType>()

  return (
    <SimpleGrid gridTemplateColumns="repeat(2, 1fr)" gap={4} px={5} pb={4}>
      <FormControl
        isInvalid={!!errors?.distributionData?.[index]?.cliff}
        isRequired={
          getValues(`distributionData.${index}.vestingType`) === "LINEAR_VESTING"
        }
      >
        <HStack alignItems="center" spacing={0}>
          <FormLabel>Cliff</FormLabel>
          <Tooltip label="Time period before the release of the first increment of tokens.">
            <Icon
              position="relative"
              left={-2}
              top={-1}
              as={Question}
              color="gray"
              boxSize={5}
            />
          </Tooltip>
        </HStack>
        <InputGroup>
          <Controller
            control={control}
            name={`distributionData.${index}.cliff`}
            rules={{
              required:
                getValues(`distributionData.${index}.vestingType`) ===
                  "LINEAR_VESTING" && "This field is required!",
              min: {
                value: 0,
                message: "Cliff must be positive",
              },
            }}
            defaultValue={0}
            render={({ field: { ref, value, onChange, onBlur } }) => (
              <NumberInput
                ref={ref}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                min={0}
              >
                <NumberInputField borderRightRadius={0} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
          <InputRightAddon bgColor="whiteAlpha.50">months</InputRightAddon>
        </InputGroup>
        <FormErrorMessage>
          {errors?.distributionData?.[index]?.cliff?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={!!errors?.distributionData?.[index]?.vestingPeriod}
        isRequired={
          getValues(`distributionData.${index}.vestingType`) === "LINEAR_VESTING"
        }
      >
        <HStack alignItems="center" spacing={0}>
          <FormLabel>Vesting</FormLabel>
          <Tooltip label="Smart contracts lock a certain amount of tokens until the desired time period.">
            <Icon
              position="relative"
              left={-2}
              top={-1}
              as={Question}
              color="gray"
              boxSize={5}
            />
          </Tooltip>
        </HStack>
        <InputGroup>
          <Controller
            control={control}
            name={`distributionData.${index}.vestingPeriod`}
            rules={{
              required:
                getValues(`distributionData.${index}.vestingType`) ===
                  "LINEAR_VESTING" && "This field is required!",
              min: {
                value: 0,
                message: "Vesting must be positive",
              },
            }}
            render={({ field: { ref, value, onChange, onBlur } }) => (
              <NumberInput
                ref={ref}
                value={value}
                onChange={(newValue) => {
                  onChange(newValue)
                  const parsedValue = parseInt(newValue)
                  if (
                    parsedValue >
                    getValues(`distributionData.${index}.distributionDuration`)
                  )
                    setValue(
                      `distributionData.${index}.distributionDuration`,
                      parsedValue
                    )
                }}
                onBlur={onBlur}
                min={0}
              >
                <NumberInputField borderRightRadius={0} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
          <InputRightAddon bgColor="whiteAlpha.50">months</InputRightAddon>
        </InputGroup>
        <FormErrorMessage>
          {errors?.distributionData?.[index]?.vestingPeriod?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={!!errors?.distributionData?.[index]?.distributionDuration}
        isRequired
      >
        <FormLabel>Distribution duration</FormLabel>
        <InputGroup>
          <Controller
            control={control}
            name={`distributionData.${index}.distributionDuration`}
            rules={{
              required: "This field is required!",
              min: {
                value: getValues(`distributionData.${index}.vestingPeriod`),
                message: "Distribution duration must be greater than vesting period",
              },
            }}
            defaultValue={12}
            render={({ field: { ref, value, onChange, onBlur } }) => (
              <NumberInput
                ref={ref}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                min={0}
              >
                <NumberInputField borderRightRadius={0} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
          <InputRightAddon bgColor="whiteAlpha.50">months</InputRightAddon>
        </InputGroup>
        <FormErrorMessage>
          {errors?.distributionData?.[index]?.distributionDuration?.message}
        </FormErrorMessage>
      </FormControl>
    </SimpleGrid>
  )
}

export default LinearVestingForm

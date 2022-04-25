import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
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
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { TokenIssuanceFormType } from "types"

type Props = {
  index: number
}

const LinearVestingForm = ({ index }: Props): JSX.Element => {
  const {
    control,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext<TokenIssuanceFormType>()

  const vestingType = useWatch({
    name: `distributionData.${index}.vestingType`,
    control,
  })

  return (
    <SimpleGrid columns={2} gap={4} px={5} pb={4}>
      <GridItem colSpan={{ base: 2, sm: 1 }}>
        <FormControl
          isInvalid={!!errors?.distributionData?.[index]?.cliff}
          isRequired={vestingType === "LINEAR_VESTING"}
        >
          <HStack alignItems="center" spacing={0}>
            <FormLabel>Cliff</FormLabel>
            <Tooltip label="Time period before the release of the first increment of tokens.">
              <Icon
                position="relative"
                left={-2}
                top={-1}
                as={Question}
                color="tokenxyz.rosybrown.500"
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
                  vestingType === "LINEAR_VESTING" && "This field is required!",
                min: vestingType === "LINEAR_VESTING" && {
                  value: 0,
                  message: "Cliff must be positive",
                },
                max: vestingType === "LINEAR_VESTING" && {
                  value: getValues(`distributionData.${index}.vestingPeriod`) - 1,
                  message: "Cliff must be less than vesting",
                },
              }}
              defaultValue={0}
              render={({ field: { ref, value, onChange, onBlur } }) => (
                <NumberInput
                  ref={ref}
                  value={value}
                  onChange={(newValue) => {
                    const parsedValue = parseInt(newValue)
                    onChange(isNaN(parsedValue) ? "" : parsedValue)
                  }}
                  onBlur={onBlur}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            />
            <InputRightAddon>months</InputRightAddon>
          </InputGroup>
          <FormErrorMessage color="tokenxyz.red.500">
            {errors?.distributionData?.[index]?.cliff?.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={{ base: 2, sm: 1 }}>
        <FormControl
          isInvalid={!!errors?.distributionData?.[index]?.vestingPeriod}
          isRequired={vestingType === "LINEAR_VESTING"}
        >
          <HStack alignItems="center" spacing={0}>
            <FormLabel>Vesting</FormLabel>
            <Tooltip label="Smart contracts lock a certain amount of tokens until the desired time period.">
              <Icon
                position="relative"
                left={-2}
                top={-1}
                as={Question}
                color="tokenxyz.rosybrown.500"
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
                  vestingType === "LINEAR_VESTING" && "This field is required!",
                min: vestingType === "LINEAR_VESTING" && {
                  value: +getValues(`distributionData.${index}.cliff`) + 1,
                  message: "Vesting must be greater than cliff",
                },
                max: vestingType === "LINEAR_VESTING" && {
                  value:
                    getValues(`distributionData.${index}.distributionDuration`) - 1,
                  message: "Vesting must be less than distribution",
                },
              }}
              render={({ field: { ref, value, onChange, onBlur } }) => (
                <NumberInput
                  ref={ref}
                  value={value}
                  onChange={(newValue) => {
                    const parsedValue = parseInt(newValue)
                    onChange(isNaN(parsedValue) ? "" : parsedValue)
                    trigger(`distributionData.${index}.cliff`)
                  }}
                  onBlur={onBlur}
                  min={+getValues(`distributionData.${index}.cliff`) + 1}
                  max={120}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            />
            <InputRightAddon>months</InputRightAddon>
          </InputGroup>
          <FormErrorMessage color="tokenxyz.red.500">
            {errors?.distributionData?.[index]?.vestingPeriod?.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={{ base: 2, sm: 1 }}>
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
                  value: +getValues(`distributionData.${index}.vestingPeriod`) + 1,
                  message:
                    +getValues(`distributionData.${index}.vestingPeriod`) === 0
                      ? "Must be a positive number"
                      : "Must be greater than vesting period",
                },
                max: {
                  value: 120,
                  message: "Maximum distribution time is 120 months",
                },
              }}
              defaultValue={12}
              render={({ field: { ref, value, onChange, onBlur } }) => (
                <NumberInput
                  ref={ref}
                  value={value}
                  onChange={(newValue) => {
                    const parsedValue = parseInt(newValue)
                    onChange(isNaN(parsedValue) ? "" : parsedValue)
                  }}
                  onBlur={onBlur}
                  min={+getValues(`distributionData.${index}.vestingPeriod`) + 1}
                  max={120}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            />
            <InputRightAddon>months</InputRightAddon>
          </InputGroup>
          <FormErrorMessage color="tokenxyz.red.500">
            {errors?.distributionData?.[index]?.distributionDuration?.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
    </SimpleGrid>
  )
}

export default LinearVestingForm

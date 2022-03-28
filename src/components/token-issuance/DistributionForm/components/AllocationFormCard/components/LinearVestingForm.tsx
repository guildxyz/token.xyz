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
    setValue,
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
                  vestingType === "LINEAR_VESTING" && "This field is required!",
                min: {
                  value: 0,
                  message: "Cliff must be positive",
                },
                max: {
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
                    onChange(parsedValue)
                    if (
                      parsedValue >=
                      getValues(`distributionData.${index}.vestingPeriod`)
                    )
                      setValue(
                        `distributionData.${index}.vestingPeriod`,
                        parsedValue + 1,
                        { shouldValidate: true }
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
                  vestingType === "LINEAR_VESTING" && "This field is required!",
                min: {
                  value: +getValues(`distributionData.${index}.cliff`) + 1,
                  message: "Vesting must be greater than cliff",
                },

                max: {
                  value: 120,
                  message: "Maximum vesting time is 120 months",
                },
              }}
              render={({ field: { ref, value, onChange, onBlur } }) => (
                <NumberInput
                  ref={ref}
                  value={value}
                  onChange={(newValue) => {
                    const parsedValue = parseInt(newValue)
                    onChange(parsedValue)
                    if (
                      parsedValue >=
                      getValues(`distributionData.${index}.distributionDuration`)
                    ) {
                      setValue(
                        `distributionData.${index}.distributionDuration`,
                        parsedValue + 1,
                        { shouldValidate: true }
                      )
                    }
                  }}
                  onBlur={onBlur}
                  min={1}
                  max={120}
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
                  message: "Must be greater than vesting period",
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
                  onChange={(newValue) => onChange(parseInt(newValue))}
                  onBlur={onBlur}
                  min={0}
                  max={120}
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
      </GridItem>
    </SimpleGrid>
  )
}

export default LinearVestingForm

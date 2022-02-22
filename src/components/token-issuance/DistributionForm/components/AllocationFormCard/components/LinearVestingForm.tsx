import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputRightAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
} from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"

type Props = {
  index: number
}

const LinearVestingForm = ({ index }: Props): JSX.Element => {
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext()

  return (
    <SimpleGrid gridTemplateColumns="repeat(2, 1fr)" gap={4} px={5} pb={4}>
      <FormControl
        isInvalid={errors?.distributionData?.[index]?.vestingPeriod}
        isRequired={
          getValues(`distributionData.${index}.vestingType`) === "LINEAR_VESTING"
        }
      >
        <FormLabel>Vesting</FormLabel>
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
          {errors?.distributionData?.[index]?.vestingPeriod?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={errors?.distributionData?.[index]?.cliff}
        isRequired={
          getValues(`distributionData.${index}.vestingType`) === "LINEAR_VESTING"
        }
      >
        <FormLabel>Cliff</FormLabel>
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
    </SimpleGrid>
  )
}

export default LinearVestingForm

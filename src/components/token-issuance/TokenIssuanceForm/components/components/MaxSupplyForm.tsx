import {
  FormControl,
  FormErrorMessage,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
} from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"

const MaxSupplyForm = (): JSX.Element => {
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext()

  return (
    <SimpleGrid gridTemplateColumns="repeat(2, 1fr)" gap={4} px={5} pb={4}>
      <FormControl isInvalid={errors?.initialSupply}>
        <Controller
          control={control}
          name="initialSupply"
          rules={{
            required:
              getValues("inflationaryModel") !== "UNLIMITED" &&
              "This field is required!",
            min: {
              value: 0,
              message: "Initial supply must be positive",
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
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />
        <FormErrorMessage>{errors?.initialSupply?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors?.maxSupply}>
        <Controller
          control={control}
          name="maxSupply"
          rules={{
            required:
              getValues("inflationaryModel") !== "UNLIMITED" &&
              "This field is required!",
            min: {
              value: 0,
              message: "Initial supply must be positive",
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
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />
        <FormErrorMessage>{errors?.maxSupply?.message}</FormErrorMessage>
      </FormControl>
    </SimpleGrid>
  )
}

export default MaxSupplyForm

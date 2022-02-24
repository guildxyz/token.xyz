import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
} from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"
import { TokenIssuanceFormType } from "types"

const FixedSupplyForm = (): JSX.Element => {
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext<TokenIssuanceFormType>()

  return (
    <SimpleGrid gridTemplateColumns="repeat(2, 1fr)" gap={4} px={5} pb={4}>
      <FormControl
        isInvalid={!!errors?.initialSupply}
        isRequired={getValues("inflationaryModel") !== "UNLIMITED"}
      >
        <FormLabel>Initial supply</FormLabel>
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
    </SimpleGrid>
  )
}

export default FixedSupplyForm

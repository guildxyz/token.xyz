import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
} from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"
import { TokenIssuanceFormType } from "types"

const UnlimitedSupplyForm = (): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TokenIssuanceFormType>()

  return (
    <SimpleGrid columns={2} gap={4} px={5} pb={4}>
      <GridItem colSpan={{ base: 2, sm: 1 }}>
        <FormControl isInvalid={!!errors?.initialSupply} isRequired={true}>
          <FormLabel>Initial supply</FormLabel>
          <Controller
            control={control}
            name="initialSupply"
            rules={{
              required: "This field is required!",
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
          <FormErrorMessage color="tokenxyz.red.500">
            {errors?.initialSupply?.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
    </SimpleGrid>
  )
}

export default UnlimitedSupplyForm

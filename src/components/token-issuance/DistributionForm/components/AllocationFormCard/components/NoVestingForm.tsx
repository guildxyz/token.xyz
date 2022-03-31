import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
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
import { TokenIssuanceFormType } from "types"

type Props = {
  index: number
}

const NoVestingForm = ({ index }: Props): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TokenIssuanceFormType>()

  return (
    <SimpleGrid columns={2} gap={4} px={5} pb={4}>
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
                  value: 0,
                  message: "Distribution duration must positive",
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
                  min={0}
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

export default NoVestingForm

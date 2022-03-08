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
    <SimpleGrid gridTemplateColumns="repeat(2, 1fr)" gap={4} px={5} pb={4}>
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

export default NoVestingForm

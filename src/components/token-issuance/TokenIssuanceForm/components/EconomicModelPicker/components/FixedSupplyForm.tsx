import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { TokenIssuanceFormType } from "types"

const FixedSupplyForm = (): JSX.Element => {
  const {
    control,
    getValues,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext<TokenIssuanceFormType>()

  const economyModel = useWatch({ control, name: "economyModel" })
  const initialSupply = useWatch({ control, name: "initialSupply" })
  const maxSupply = useWatch({ control, name: "maxSupply" })

  return (
    <SimpleGrid columns={2} gap={4} px={5} pb={4}>
      <GridItem colSpan={{ base: 2, sm: 1 }}>
        <FormControl
          minW={0}
          isInvalid={!!errors?.initialSupply}
          isRequired={economyModel !== "UNLIMITED"}
        >
          <FormLabel>Initial supply</FormLabel>
          <Controller
            control={control}
            name="initialSupply"
            rules={{
              required: "This field is required!",
              min: {
                value: 0,
                message: "Must be positive",
              },
              max:
                economyModel !== "UNLIMITED" && dirtyFields.maxSupply
                  ? {
                      value: maxSupply,
                      message: "Must be less than max supply",
                    }
                  : undefined,
            }}
            defaultValue={0}
            render={({ field: { ref, value, onChange, onBlur } }) => (
              <NumberInput
                ref={ref}
                value={value}
                onChange={(newValue) => {
                  onChange(newValue)
                  const parsedValue = parseInt(newValue)
                  if (parsedValue >= getValues("maxSupply"))
                    setValue("maxSupply", parsedValue + 1)
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
          <FormErrorMessage>{errors?.initialSupply?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={{ base: 2, sm: 1 }}>
        <FormControl
          minW={0}
          isInvalid={!!errors?.maxSupply}
          isRequired={economyModel !== "UNLIMITED"}
        >
          <FormLabel>Max supply</FormLabel>
          <Controller
            control={control}
            name="maxSupply"
            rules={{
              required: economyModel !== "UNLIMITED" && "This field is required!",
              min: {
                value: initialSupply,
                message: "Must be greater than initial supply",
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
      </GridItem>

      <GridItem minW={0} colSpan={2}>
        <Alert status="info">
          <Stack>
            <HStack spacing={0.5}>
              <AlertIcon mt={0} mr={2} />

              <AlertTitle>Tip</AlertTitle>
            </HStack>
            <AlertDescription
              fontWeight="normal"
              fontSize="sm"
              whiteSpace="break-spaces"
            >
              <Text>
                <b>Initial = Max supply:</b>
                {` no more tokens will be minted after this amount.`}
              </Text>

              <Text>
                <b>Initial &lt; Max supply:</b>
                {` more tokens can be minted until the amount reaches the Max supply.`}
              </Text>
            </AlertDescription>
          </Stack>
        </Alert>
      </GridItem>
    </SimpleGrid>
  )
}

export default FixedSupplyForm

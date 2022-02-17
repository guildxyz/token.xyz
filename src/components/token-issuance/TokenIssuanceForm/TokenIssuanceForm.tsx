import {
  Circle,
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import FormSection from "components/common/FormSection"
import { Question } from "phosphor-react"
import { useFormContext } from "react-hook-form"
import InflationaryModelPicker from "./components/InflationaryModelPicker"

const TokenIssuanceForm = (): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  return (
    <VStack spacing={8} alignItems="start" w="max-content">
      <FormSection title="General data">
        <HStack spacing={4} alignItems="start">
          <Circle size={10} bgColor="gray.700">
            <Text as="span" color="gray" fontSize="xs">
              img
            </Text>
          </Circle>
          <FormControl isInvalid={errors?.tokenName} w="max-content">
            <Input
              {...register("tokenName", { required: "This field is required!" })}
              placeholder="Token name"
            />
            <FormErrorMessage>{errors?.tokenName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors?.tokenTicker} w="max-content">
            <InputGroup w="max-content">
              <Input
                {...register("tokenTicker", { required: "This field is required!" })}
                placeholder="Ticker"
                maxW={36}
              />
              <InputRightElement>
                <Tooltip label="A ticker means a short symbol for your token, used by exchanges.">
                  <Icon as={Question} color="gray" />
                </Tooltip>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors?.tokenTicker?.message}</FormErrorMessage>
          </FormControl>
        </HStack>

        <FormControl isInvalid={errors?.initialSupply} w="full">
          <Input
            {...register("initialSupply", { required: "This field is required!" })}
            placeholder="Initial supply"
          />
          <FormErrorMessage>{errors?.initialSupply?.message}</FormErrorMessage>
        </FormControl>
      </FormSection>

      <FormSection title="Inflationary model">
        <FormControl isInvalid={errors?.inflationaryModel}>
          <InflationaryModelPicker />
          <FormErrorMessage>{errors?.inflationaryModel?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors?.maxSupply} w="full">
          <InputGroup>
            <Input
              {...register("maxSupply", { required: "This field is required!" })}
              placeholder="Max supply"
            />
            <InputRightElement>
              <Tooltip label="Fully diluted token supply">
                <Icon as={Question} color="gray" />
              </Tooltip>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors?.maxSupply?.message}</FormErrorMessage>
        </FormControl>
      </FormSection>
    </VStack>
  )
}

export default TokenIssuanceForm

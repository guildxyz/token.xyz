import {
  Circle,
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import FormSection from "components/common/FormSection"
import { Question } from "phosphor-react"
import { useFormContext } from "react-hook-form"
import shortenHex from "utils/shortenHex"
import { useAccount } from "wagmi"

const TokenIssuanceForm = (): JSX.Element => {
  const [{ data: accountData }] = useAccount()

  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <VStack spacing={8} alignItems="start" w="max-content">
      <FormSection title="General data">
        <HStack spacing={4} alignItems="start">
          <Circle size={12} bgColor="gray.700">
            <Text as="span" color="gray" fontSize="xs">
              img
            </Text>
          </Circle>
          <FormControl isInvalid={errors?.tokenName} w="max-content">
            <Input
              size="lg"
              {...register("tokenName", { required: "This field is required!" })}
              placeholder="Token name"
            />
            <FormErrorMessage>{errors?.tokenName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors?.tokenTicker} w="max-content">
            <InputGroup w="max-content">
              <Input
                size="lg"
                {...register("tokenTicker", { required: "This field is required!" })}
                placeholder="Ticker"
                maxW={36}
              />
              <InputRightElement h="full" alignItems="center">
                <Tooltip label="A ticker means a short symbol for your token, used by exchanges.">
                  <Icon as={Question} color="gray" boxSize={5} />
                </Tooltip>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors?.tokenTicker?.message}</FormErrorMessage>
          </FormControl>
        </HStack>

        <FormControl isInvalid={errors?.initialSupply} w="full">
          <Input
            size="lg"
            {...register("initialSupply", { required: "This field is required!" })}
            placeholder="Initial supply"
          />
          <FormErrorMessage>{errors?.initialSupply?.message}</FormErrorMessage>
        </FormControl>
      </FormSection>

      <FormSection title="Transfer ownership">
        <FormControl isInvalid={errors?.transferOwnershipTo}>
          <InputGroup>
            <Input
              size="lg"
              {...register("transferOwnershipTo")}
              placeholder={shortenHex(accountData?.address)}
            />
            <InputRightElement h="full" alignItems="center">
              <Tooltip label="TODO">
                <Icon as={Question} color="gray" boxSize={5} />
              </Tooltip>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors?.transferOwnershipTo?.message}</FormErrorMessage>
        </FormControl>
      </FormSection>

      <FormSection title="Chain">
        <Select {...register("chain")} size="lg" maxW="48" defaultValue="ETHEREUM">
          <option value="ETHEREUM">Ethereum</option>
          <option value="POLYGON" disabled>
            Polygon (soon)
          </option>
          <option value="BSC" disabled>
            BSC (soon)
          </option>
        </Select>
      </FormSection>

      {/* <FormSection title="Inflationary model">
        <FormControl isInvalid={errors?.inflationaryModel}>
          <InflationaryModelPicker />
          <FormErrorMessage>{errors?.inflationaryModel?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors?.maxSupply} w="full">
          <InputGroup>
            <Input
              size="lg"
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
      </FormSection> */}
    </VStack>
  )
}

export default TokenIssuanceForm
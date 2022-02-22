import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  SimpleGrid,
  Stack,
  Tooltip,
} from "@chakra-ui/react"
import { useTimeline } from "components/common/Timeline/components/TimelineContext"
import FormSection from "components/forms/FormSection"
import { ImageSquare, Question } from "phosphor-react"
import { Controller, useFormContext } from "react-hook-form"
import shortenHex from "utils/shortenHex"
import { useAccount } from "wagmi"
import InflationaryModelPicker from "./components/InflationaryModelPicker"

const TokenIssuanceForm = (): JSX.Element => {
  const [{ data: accountData }] = useAccount()

  const { next } = useTimeline()

  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext()

  const isNextButtonDisabled = () =>
    !getValues("tokenName") ||
    !getValues("tokenTicker") ||
    errors.tokenName ||
    errors.tokenTicker ||
    errors.initialSupply ||
    errors.maxSupply

  return (
    <Stack spacing={8}>
      <FormSection title="General data">
        <SimpleGrid w="full" gridTemplateColumns="3rem 2fr 1fr" gap={4}>
          <IconButton
            autoFocus
            aria-label="Upload image"
            icon={<Icon as={ImageSquare} />}
            rounded="full"
            boxSize={12}
            flexShrink={0}
            colorScheme="gray"
            variant="outline"
            borderWidth={1}
            bg="blackAlpha.300"
            // onClick={onOpen}
          />
          <FormControl isInvalid={errors?.tokenName}>
            <Input
              size="lg"
              {...register("tokenName", { required: "This field is required!" })}
              placeholder="Token name"
            />
            <FormErrorMessage>{errors?.tokenName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors?.tokenTicker}>
            <InputGroup>
              <Input
                size="lg"
                {...register("tokenTicker", { required: "This field is required!" })}
                placeholder="Ticker"
              />
              <InputRightElement h="full" alignItems="center">
                <Tooltip label="A ticker means a short symbol for your token, used by exchanges.">
                  <Icon as={Question} color="gray" boxSize={5} />
                </Tooltip>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors?.tokenTicker?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
      </FormSection>

      <FormSection title="Inflationary model">
        <InflationaryModelPicker />
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
        <Controller
          control={control}
          name="chain"
          defaultValue="GOERLI"
          render={({ field: { ref, value, onChange, onBlur } }) => (
            <Select
              ref={ref}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              size="lg"
              maxW="48"
            >
              <option value="GOERLI">Görli</option>
              <option value="ETHEREUM">Ethereum</option>
              <option value="POLYGON" disabled>
                Polygon (soon)
              </option>
              <option value="BSC" disabled>
                BSC (soon)
              </option>
            </Select>
          )}
        />
      </FormSection>

      <Flex mt="auto" width="100%" justifyContent="end">
        <Button
          onClick={next}
          colorScheme="primary"
          isDisabled={isNextButtonDisabled()}
        >
          Continue to Distribution
        </Button>
      </Flex>
    </Stack>
  )
}

export default TokenIssuanceForm

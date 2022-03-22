import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  GridItem,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Stack,
  Tooltip,
} from "@chakra-ui/react"
import { useTimeline } from "components/common/Timeline/components/TimelineContext"
import FormSection from "components/forms/FormSection"
import { chains } from "connectors"
import useMyUrlNames from "hooks/useMyUrlNames"
import { Question } from "phosphor-react"
import { useEffect } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import shortenHex from "utils/shortenHex"
import slugify from "utils/slugify"
import { useAccount, useNetwork } from "wagmi"
import EconomyModelPicker from "./components/EconomicModelPicker"
import IconPicker from "./components/IconPicker"

const TokenIssuanceForm = (): JSX.Element => {
  const [{ data: networkData }, switchNetwork] = useNetwork()
  const [{ data: accountData }] = useAccount()
  const { data: reusableUrlNames, isValidating: reusableUrlNamesLoading } =
    useMyUrlNames()

  const { next } = useTimeline()

  const {
    control,
    register,
    getValues,
    setValue,
    formState: { errors, touchedFields },
  } = useFormContext<TokenIssuanceFormType>()

  useEffect(() => {
    if (!register) return
    register("urlName")
    register("decimals")
  }, [register])

  const tokenName = useWatch({ control, name: "tokenName" })

  const urlNameSelect = useWatch({ control, name: "urlNameSelect" })
  useEffect(() => {
    if (urlNameSelect === "GENERATE") return
    setValue("urlName", urlNameSelect)
  }, [urlNameSelect])

  // TODO: check if the urlName already exists, and ask for another token name if needed!
  useEffect(() => {
    if (touchedFields.urlName || urlNameSelect !== "GENERATE") return
    setValue("urlName", slugify(tokenName || ""))
  }, [tokenName, urlNameSelect])

  const urlName = useWatch({ control, name: "urlName" })

  const isNextButtonDisabled = () =>
    !getValues("tokenName") ||
    !getValues("tokenTicker") ||
    (getValues("economyModel") !== "UNLIMITED" && getValues("initialSupply") < 1) ||
    !!errors.tokenName ||
    !!errors.tokenTicker ||
    !!errors.initialSupply ||
    !!errors.maxSupply

  return (
    <Stack spacing={8}>
      <FormSection title="General data">
        <SimpleGrid
          w="full"
          gridTemplateColumns={{ base: "3rem auto", sm: "3rem 2fr 1fr" }}
          gap={4}
        >
          <GridItem order={1}>
            <IconPicker />
          </GridItem>

          <GridItem order={{ base: 3, sm: 2 }} colSpan={{ base: 2, sm: 1 }}>
            <FormControl isInvalid={!!errors?.tokenName}>
              <Input
                size="lg"
                {...register("tokenName", { required: "This field is required!" })}
                placeholder="Token name"
              />
              <FormErrorMessage>{errors?.tokenName?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem order={{ base: 2, sm: 3 }}>
            <FormControl isInvalid={!!errors?.tokenTicker}>
              <InputGroup>
                <Input
                  size="lg"
                  {...register("tokenTicker", {
                    required: "This field is required!",
                  })}
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
          </GridItem>
        </SimpleGrid>
      </FormSection>

      <FormSection
        title="URL name"
        description="Choose a unique identifier for your token or generate a new one. If this is your first token, we'll generate a new URL name automatically"
      >
        <SimpleGrid columns={3} gap={4}>
          <GridItem colSpan={{ base: 3, md: 1 }}>
            <FormControl>
              <Controller
                control={control}
                name="urlNameSelect"
                defaultValue="GENERATE"
                render={({ field: { ref, value, onChange, onBlur } }) => (
                  <Select
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    isDisabled={reusableUrlNamesLoading || !reusableUrlNames?.length}
                    size="lg"
                  >
                    {reusableUrlNames?.length ? (
                      <>
                        <option value="GENERATE">Generate new</option>
                        {reusableUrlNames.map((reusableUrlName) => (
                          <option key={reusableUrlName} value={reusableUrlName}>
                            {reusableUrlName}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option>
                        {reusableUrlNamesLoading ? "Loading..." : "No options"}
                      </option>
                    )}
                  </Select>
                )}
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 3, md: 2 }}>
            <Input value={urlName} size="lg" disabled />
          </GridItem>
        </SimpleGrid>
      </FormSection>

      <FormSection title="Choose a token economy model:">
        <EconomyModelPicker />
      </FormSection>

      <FormSection title="Chain">
        <Controller
          control={control}
          name="chain"
          defaultValue={networkData?.chain?.id}
          render={({ field: { ref, value, onChange, onBlur } }) => (
            <Select
              ref={ref}
              value={value}
              onChange={(e) => {
                switchNetwork(parseInt(e.target.value))
                  .then((res) => {
                    if (res.error || !res.data) return
                    onChange(res.data.id)
                  })
                  .catch((_) => {})
              }}
              onBlur={onBlur}
              size="lg"
              maxW="48"
            >
              {chains?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              <option value={1} disabled>
                Ethereum (soon)
              </option>
              <option value={137} disabled>
                Polygon (soon)
              </option>
              <option value={56} disabled>
                BSC (soon)
              </option>
            </Select>
          )}
        />
      </FormSection>

      <Accordion allowToggle>
        <AccordionItem border="none">
          <AccordionButton
            mb={4}
            p={0}
            maxW="max-content"
            _hover={{ bgColor: null }}
          >
            <Box pr={2} textAlign="left" fontWeight="bold">
              Advanced settings
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={0} pt={4} borderTopWidth={1}>
            <Stack spacing={8}>
              <FormControl isInvalid={!!errors?.transferOwnershipTo}>
                <FormLabel>Transfer ownership</FormLabel>
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
                <FormErrorMessage>
                  {errors?.transferOwnershipTo?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                pr={{ base: 2, md: 8 }}
                pb={4}
                isRequired
                isInvalid={!!errors?.decimals}
              >
                <FormLabel>Decimals</FormLabel>
                <FormHelperText mb={4}>
                  Most widely supported is 18, but you can set another value here if
                  you wish.
                </FormHelperText>
                <Controller
                  control={control}
                  name="decimals"
                  rules={{
                    required: "This field is required!",
                    min: {
                      value: 0,
                      message: "Must positive",
                    },
                    max: {
                      value: 255,
                      message: "Maximum 255",
                    },
                  }}
                  defaultValue={18}
                  render={({ field: { ref, value, onChange, onBlur } }) => (
                    <NumberInput
                      ref={ref}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      min={0}
                      max={255}
                      size="lg"
                      maxW={{ base: "full", md: "50%" }}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
                <FormErrorMessage>{errors?.decimals?.message}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Ownable / access control</FormLabel>
                <Controller
                  control={control}
                  name="ownable"
                  defaultValue={true}
                  render={({ field: { ref, value, onChange, onBlur } }) => (
                    <RadioGroup
                      ref={ref}
                      value={value.toString()}
                      onChange={onChange}
                      onBlur={onBlur}
                      colorScheme="primary"
                    >
                      <Stack spacing={2}>
                        <Radio value="true" maxW="max-content">
                          Ownable
                        </Radio>
                        <Radio value="false" maxW="max-content">
                          Access control
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

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

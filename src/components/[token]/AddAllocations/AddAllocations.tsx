import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Stack,
  Tooltip,
} from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import DynamicDevTool from "components/forms/DynamicDevTool"
import AllocationFormCard from "components/token-issuance/DistributionForm/components/AllocationFormCard"
import { ChainSlugs } from "connectors"
import useToast from "hooks/useToast"
import useTokenData from "hooks/useTokenData"
import { useMemo } from "react"
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import { useAccount, useNetwork } from "wagmi"
import useAddAllocations from "./hooks/useAddAllocations"

const AddAllocations = (): JSX.Element => {
  const [{ data: networkData }, switchNetwork] = useNetwork()
  const [{ data: accountData }] = useAccount()
  const { data: tokenData } = useTokenData()

  const { control, handleSubmit } = useFormContext<TokenIssuanceFormType>()
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "distributionData",
  })

  const distributionData = useWatch({
    control: control,
    name: "distributionData",
  })

  const isSubmitDisabled = useMemo(() => {
    if (!distributionData?.length) return true
    return !distributionData.every(
      (allocationData) =>
        !!(allocationData.allocationAddressesAmounts?.length > 0) &&
        distributionData.every((allocation) =>
          allocation.vestingType === "LINEAR_VESTING"
            ? allocation.cliff < allocation.vestingPeriod &&
              allocation.vestingPeriod < allocation.distributionDuration
            : true
        )
    )
  }, [distributionData])

  const { startAddAllocations, isLoading, loadingText } = useAddAllocations()

  const shouldSwitchChain = useMemo(
    () => tokenData?.chainId !== networkData?.chain?.id,
    [tokenData, networkData]
  )

  const toast = useToast()
  const requestManualNetworkChange = (chainName: string) => () =>
    toast({
      title: "Your wallet doesn't support switching chains automatically",
      description: `Please switch to ${chainName} from your wallet manually!`,
      status: "error",
      duration: 4000,
    })

  return (
    <Stack mx="auto" maxW="container.sm" spacing={8}>
      {shouldSwitchChain && accountData ? (
        <Alert
          status="error"
          bgColor="tokenxyz.red.100"
          color="tokenxyz.red.500"
          borderColor="tokenxyz.red.500"
          maxW="container.sm"
        >
          <AlertIcon color="tokenxyz.red.500" />
          <Stack
            w="full"
            direction={{ base: "column", md: "row" }}
            spacing={4}
            alignItems="end"
          >
            <Stack w="full">
              <AlertTitle>Uh-oh!</AlertTitle>
              <AlertDescription>
                {`Please switch to ${
                  ChainSlugs[tokenData?.chainId]
                } in order to access this page!`}
              </AlertDescription>
            </Stack>

            <Button
              minW={44}
              colorScheme="tokenxyz.red"
              onClick={() =>
                switchNetwork
                  ? switchNetwork(tokenData?.chainId)
                  : requestManualNetworkChange(ChainSlugs[tokenData?.chainId])
              }
            >{`Switch to ${ChainSlugs[tokenData?.chainId]}`}</Button>
          </Stack>
        </Alert>
      ) : (
        <>
          {fields.map((field, index) => (
            <AllocationFormCard
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
            />
          ))}

          {fields?.length < 3 ? (
            <AddCard text="New group" onClick={() => append({})} />
          ) : (
            <Tooltip label="You can add up to 3 distribution groups">
              <Box>
                <AddCard text="New group" disabled />
              </Box>
            </Tooltip>
          )}

          <Button
            colorScheme="tokenxyz.rosybrown"
            disabled={isSubmitDisabled || isLoading}
            isLoading={isLoading}
            loadingText={loadingText}
            // TODO: error handling
            onClick={handleSubmit(startAddAllocations, console.log)}
          >
            Submit
          </Button>
        </>
      )}
    </Stack>
  )
}

const AddAllocationsWrapper = (): JSX.Element => {
  const methods = useForm<TokenIssuanceFormType>()

  return (
    <FormProvider {...methods}>
      <AddAllocations />
      <DynamicDevTool control={methods.control} />
    </FormProvider>
  )
}

export default AddAllocationsWrapper

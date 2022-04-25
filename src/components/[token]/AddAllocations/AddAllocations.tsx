import { Box, Button, Stack, Tooltip } from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import DynamicDevTool from "components/forms/DynamicDevTool"
import AllocationFormCard from "components/token-issuance/DistributionForm/components/AllocationFormCard"
import { useMemo } from "react"
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import useAddAllocations from "./hooks/useAddAllocations"

const AddAllocations = (): JSX.Element => {
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
    if (!distributionData) return false
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

  const { startAddAllocations, isLoading, loadingText, finished } =
    useAddAllocations()

  return (
    <Stack mx="auto" maxW="container.sm" spacing={8}>
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

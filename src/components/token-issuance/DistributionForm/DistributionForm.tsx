import { Button, Flex, Stack } from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import { useTimeline } from "components/common/Timeline/components/TimelineContext"
import FormSection from "components/forms/FormSection"
import { useMemo } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import AllocationFormCard from "./components/AllocationFormCard"
import Chart from "./components/Chart"

const DistributionForm = (): JSX.Element => {
  const { next } = useTimeline()

  const { control } = useFormContext<TokenIssuanceFormType>()
  const { fields, append, remove } = useFieldArray({ name: "distributionData" })

  const distributionData = useWatch({ control, name: "distributionData" })

  const isNextButtonDisabled = useMemo(() => {
    if (!distributionData) return false
    return !distributionData.every(
      (allocationData) => !!(allocationData.allocationAddressesAmounts?.length > 0)
    )
  }, [distributionData])

  return (
    <Stack spacing={8} w="full">
      <Chart />

      <FormSection
        title="How do you want to airdrop the tokens?"
        description="Set up distribution groups with a custom list of participants, allocation sizes and vesting periods."
      >
        <Stack spacing={8} w="full">
          {fields.map((field, index) => (
            <AllocationFormCard
              key={field.id}
              index={index}
              field={field}
              onRemove={() => remove(index)}
            />
          ))}

          <AddCard text="New group" onClick={() => append({})} />
        </Stack>
      </FormSection>

      <Flex mt="auto" width="100%" justifyContent="end">
        <Button
          onClick={next}
          colorScheme="primary"
          isDisabled={isNextButtonDisabled}
        >
          Continue to Deploy
        </Button>
      </Flex>
    </Stack>
  )
}

export default DistributionForm

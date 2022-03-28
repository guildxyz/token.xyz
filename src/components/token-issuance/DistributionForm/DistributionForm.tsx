import { Box, Button, Flex, Stack, Tooltip } from "@chakra-ui/react"
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

  return (
    <>
      <Chart />

      <Stack mt={8} spacing={8}>
        <FormSection
          title="How do you want to airdrop the tokens?"
          description="Set up distribution groups with a custom list of participants, allocation sizes and vesting periods."
          color="tokenxyz.blue.500"
        >
          <Stack spacing={8} w="full">
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
          </Stack>
        </FormSection>

        <Flex mt="auto" width="100%" justifyContent="end">
          <Button
            colorScheme="tokenxyz.rosybrown"
            onClick={next}
            isDisabled={isNextButtonDisabled}
          >
            Continue to Deploy
          </Button>
        </Flex>
      </Stack>
    </>
  )
}

export default DistributionForm

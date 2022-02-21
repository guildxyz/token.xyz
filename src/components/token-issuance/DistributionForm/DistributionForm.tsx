import { Box, Button, Flex, SimpleGrid, Stack, Tooltip } from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import Card from "components/common/Card"
import { useTimeline } from "components/common/Timeline/components/TImelineContext"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import AllocationFormCard from "./components/AllocationFormCard"
import Chart from "./components/Chart"

const DistributionForm = (): JSX.Element => {
  const { next } = useTimeline()

  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name: "distributionData" })

  const distributionData = useWatch({ name: "distributionData", control })

  return (
    <Stack spacing={8} w="full">
      {distributionData?.length && (
        <Card px={{ base: 5, sm: 6 }} py={7}>
          <Chart />
        </Card>
      )}

      {fields.map((field, index) => (
        <AllocationFormCard
          key={field.id}
          index={index}
          field={field}
          onRemove={() => remove(index)}
        />
      ))}

      <SimpleGrid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
        <AddCard text="Claiming" onClick={() => append({})} />
        <Tooltip label="Coming soon">
          <Box>
            <AddCard text="Distribution" />
          </Box>
        </Tooltip>
      </SimpleGrid>

      <Flex mt="auto" width="100%" justifyContent="end">
        <Button
          onClick={next}
          colorScheme="primary"
          // isDisabled={isNextButtonDisabled()}
        >
          Continue to Deploy
        </Button>
      </Flex>
    </Stack>
  )
}

export default DistributionForm

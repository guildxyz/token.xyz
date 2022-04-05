import { Stack } from "@chakra-ui/react"
import { useAllocation } from "../common/AllocationContext"
import Cohort from "./components/Cohort"

const LinearVesting = (): JSX.Element => {
  const { merkleVesting } = useAllocation()

  return (
    <Stack spacing={8} w="full" alignItems="center">
      {merkleVesting?.cohorts?.map((cohort) => (
        <Cohort key={cohort.merkleRoot} cohortIpfsData={cohort} />
      ))}
    </Stack>
  )
}

export default LinearVesting

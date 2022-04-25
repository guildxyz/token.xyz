import { AllocationFormType } from "types"

// Converter function which returns the amount of tokens needed to be sent to each vesting/distributor contract
const converter = (input: Array<AllocationFormType>): number => {
  if (!input) return 0
  return input
    .map((allocation) => allocation.allocationAddressesAmounts)
    ?.reduce((arr1, arr2) => arr1.concat(arr2), [])
    ?.filter((item) => !!item)
    ?.map((data) => parseInt(data.amount))
    ?.reduce((amount1, amount2) => amount1 + amount2, 0)
}

export default converter

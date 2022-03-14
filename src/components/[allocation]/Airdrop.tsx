import { Text } from "@chakra-ui/react"
import { useAllocation } from "./AllocationContext"

const Airdrop = (): JSX.Element => {
  const { name } = useAllocation()

  return <Text>Airdrop page ({name})</Text>
}

export default Airdrop

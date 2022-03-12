import DisplayCard from "components/common/DisplayCard"
import useAllocationData from "./hooks/useAllocationData"

type Props = {
  fileName: string
}

const AllocationCard = ({ fileName }: Props): JSX.Element => {
  const { data, isValidating, error } = useAllocationData(fileName)

  return (
    <DisplayCard
      title={isValidating ? "Loading..." : error ? "ERROR" : data?.name}
    />
  )
}

export default AllocationCard

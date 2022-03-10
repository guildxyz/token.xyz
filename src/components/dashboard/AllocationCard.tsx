import DisplayCard from "components/common/DisplayCard"
import useAllocationData from "./hooks/useAllocationData"

type Props = {
  ipfsHash: string
  fileName: string
}

const AllocationCard = ({ ipfsHash, fileName }: Props): JSX.Element => {
  const { data, isValidating, error } = useAllocationData(ipfsHash, fileName)

  return (
    <DisplayCard
      title={isValidating ? "Loading..." : error ? "ERROR" : data?.name}
    />
  )
}

export default AllocationCard

import DisplayCard from "components/common/DisplayCard"
import Link from "components/common/Link"
import { useRouter } from "next/router"
import useAllocationData from "./hooks/useAllocationData"

type Props = {
  fileName: string
  prettyUrl: string
}

const AllocationCard = ({ fileName, prettyUrl }: Props): JSX.Element => {
  const router = useRouter()
  const { data, isValidating, error } = useAllocationData(fileName)

  return (
    <Link
      href={`/token/${router.query?.token?.toString()}/${prettyUrl}`}
      _hover={{ textDecoration: "none" }}
    >
      <DisplayCard
        title={isValidating ? "Loading..." : error ? "ERROR" : data?.name}
      />
    </Link>
  )
}

export default AllocationCard

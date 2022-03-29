import { Spinner, Tag } from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import Link from "components/common/Link"
import useAllocationData from "hooks/useAllocationData"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { useTimer } from "react-timer-hook"

type Props = {
  fileName: string
  prettyUrl: string
}

const AllocationCard = ({ fileName, prettyUrl }: Props): JSX.Element => {
  const router = useRouter()
  const { data, isValidating, error } = useAllocationData(fileName)

  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: new Date(
      data?.distributionEnd ? data.distributionEnd * 1000 : 0
    ),
    autoStart: false,
  })

  const ended = useMemo(
    () => !days && !hours && !minutes && !seconds,
    [days, hours, minutes, seconds]
  )

  return (
    <Link
      href={`/token/${router.query?.chain?.toString()}/${router.query?.token?.toString()}/${prettyUrl}`}
      _hover={{ textDecoration: "none" }}
    >
      <DisplayCard
        title={isValidating ? "Loading..." : error ? "ERROR" : data?.name}
      >
        <Tag bgColor="tokenxyz.rosybrown.100" color="tokenxyz.rosybrown.500">
          {!data?.distributionEnd ? (
            <Spinner size="xs" />
          ) : ended ? (
            "Ended"
          ) : (
            `Ends in ${
              days
                ? `${days} days`
                : hours
                ? ``
                : minutes
                ? `${minutes} minutes`
                : `${seconds} seconds`
            }`
          )}
        </Tag>
      </DisplayCard>
    </Link>
  )
}

export default AllocationCard

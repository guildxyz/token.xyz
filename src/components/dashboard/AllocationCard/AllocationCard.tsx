import { Spinner, Tag, Wrap } from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import Link from "components/common/Link"
import { utils } from "ethers"
import useAllocationData from "hooks/useAllocationData"
import { useRouter } from "next/router"
import { useToken } from "wagmi"
import TimerTag from "./components/TimerTag"

type Props = {
  fileName: string
  prettyUrl: string
}

const AllocationCard = ({ fileName, prettyUrl }: Props): JSX.Element => {
  const router = useRouter()
  const { data, isValidating, error } = useAllocationData(fileName)
  const [{ data: tokenData }] = useToken({
    address: data?.tokenAddress,
  })

  return (
    <Link
      href={`/token/${router.query?.chain?.toString()}/${router.query?.token?.toString()}/${prettyUrl}`}
      _hover={{ textDecoration: "none" }}
    >
      <DisplayCard
        title={isValidating ? "Loading..." : error ? "ERROR" : data?.name}
      >
        <Wrap spacing={1.5}>
          <Tag bgColor="tokenxyz.rosybrown.100" color="tokenxyz.rosybrown.500">
            {data?.tokenTotal && tokenData?.decimals && tokenData?.symbol ? (
              `${parseInt(
                utils.formatUnits(data.tokenTotal, tokenData.decimals)
              )} $${tokenData.symbol}`
            ) : (
              <Spinner size="xs" />
            )}
          </Tag>

          <TimerTag
            expirityTime={data?.distributionEnd && data.distributionEnd * 1000}
          />
        </Wrap>
      </DisplayCard>
    </Link>
  )
}

export default AllocationCard

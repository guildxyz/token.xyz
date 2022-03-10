import DisplayCard from "components/common/DisplayCard"
import Link from "components/common/Link"
import shortenHex from "utils/shortenHex"
import { useToken } from "wagmi"

type Props = {
  address: string
}

const TokenCard = ({ address }: Props): JSX.Element => {
  const [{ data, error, loading }] = useToken({ address })

  return (
    <Link href={`/dashboard/${address}`} _hover={{ textDecoration: "none" }}>
      <DisplayCard
        title={loading ? shortenHex(address, 4) : error ? "ERROR" : data?.symbol}
      />
    </Link>
  )
}

export default TokenCard

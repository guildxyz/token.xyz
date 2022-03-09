import DisplayCard from "components/common/DisplayCard"
import shortenHex from "utils/shortenHex"
import { useToken } from "wagmi"

type Props = {
  address: string
}

const TokenCard = ({ address }: Props): JSX.Element => {
  const [{ data, error, loading }] = useToken({ address })

  return (
    <DisplayCard
      title={loading ? shortenHex(address, 4) : error ? "ERROR" : data?.symbol}
    />
  )
}

export default TokenCard

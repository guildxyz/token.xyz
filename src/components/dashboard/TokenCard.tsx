import DisplayCard from "components/common/DisplayCard"
import Link from "components/common/Link"
import useTokenDataFromIpfs from "hooks/useTokenDataFromIPFS"
import shortenHex from "utils/shortenHex"
import { useToken } from "wagmi"

type Props = {
  chain: string
  address: string
}

const TokenCard = ({ chain, address }: Props): JSX.Element => {
  const [{ data, error, loading }] = useToken({ address })
  const { data: tokenDataFromIpfs, isValidating } = useTokenDataFromIpfs(
    chain,
    address
  )

  // if (tokenDataFromIpfs && !tokenDataFromIpfs?.displayInExplorer) return null

  return (
    <Link href={`/token/${chain}/${address}`} _hover={{ textDecoration: "none" }}>
      <DisplayCard
        title={
          loading || isValidating
            ? shortenHex(address, 4)
            : error
            ? "ERROR"
            : data?.symbol
        }
        image={
          tokenDataFromIpfs?.icon
            ? `${process.env.NEXT_PUBLIC_FLEEK_BUCKET}/${chain}/${address}/${tokenDataFromIpfs.icon}`
            : undefined
        }
      />
    </Link>
  )
}

export default TokenCard

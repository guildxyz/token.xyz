import { Spinner, Tag, Wrap } from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import Link from "components/common/Link"
import { utils } from "ethers"
import useTokenDataFromContract from "hooks/useTokenDataFromContract"
import useTokenDataFromIpfs from "hooks/useTokenDataFromIPFS"
import shortenHex from "utils/shortenHex"

type Props = {
  chain: string
  address: string
}

const TokenCard = ({ chain, address }: Props): JSX.Element => {
  const { data, error, isValidating } = useTokenDataFromContract(address)
  const { data: tokenDataFromIpfs } = useTokenDataFromIpfs(chain, address)
  // if (tokenDataFromIpfs && !tokenDataFromIpfs?.displayInExplorer) return null

  return (
    <Link href={`/token/${chain}/${address}`} _hover={{ textDecoration: "none" }}>
      <DisplayCard
        title={!data ? shortenHex(address, 4) : error ? "ERROR" : data?.name}
        image={
          tokenDataFromIpfs?.icon
            ? `${process.env.NEXT_PUBLIC_FLEEK_BUCKET}/${chain}/${address}/${tokenDataFromIpfs.icon}`
            : undefined
        }
      >
        <Wrap spacing={1.5}>
          <Tag bgColor="tokenxyz.rosybrown.100" color="tokenxyz.rosybrown.500">
            {!isValidating && data?.symbol ? (
              `$${data.symbol}`
            ) : (
              <Spinner size="xs" />
            )}
          </Tag>
          <Tag bgColor="tokenxyz.rosybrown.100" color="tokenxyz.rosybrown.500">
            {!isValidating && data?.totalSupply && data?.decimals ? (
              `Supply: ${Number(
                utils.formatUnits(data.totalSupply.toString(), data.decimals)
              ).toLocaleString("en")}`
            ) : (
              <Spinner size="xs" />
            )}
          </Tag>
          <Tag bgColor="tokenxyz.rosybrown.100" color="tokenxyz.rosybrown.500">
            {tokenDataFromIpfs ? (
              `${tokenDataFromIpfs.airdrops?.length || 0} airdrop${
                tokenDataFromIpfs.airdrops?.length > 1 ? "s" : ""
              }`
            ) : (
              <Spinner size="xs" />
            )}
          </Tag>

          <Tag bgColor="tokenxyz.rosybrown.100" color="tokenxyz.rosybrown.500">
            {tokenDataFromIpfs ? (
              `${tokenDataFromIpfs.vestings?.length || 0} vesting${
                tokenDataFromIpfs.vestings?.length > 1 ? "s" : ""
              }`
            ) : (
              <Spinner size="xs" />
            )}
          </Tag>
        </Wrap>
      </DisplayCard>
    </Link>
  )
}

export default TokenCard

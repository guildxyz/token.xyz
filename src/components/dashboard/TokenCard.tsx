import { Spinner, Tag, Wrap } from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import Link from "components/common/Link"
import useTokenData from "hooks/useTokenData"
import shortenHex from "utils/shortenHex"

type Props = {
  chain: string
  address: string
}

const TokenCard = ({ chain, address }: Props): JSX.Element => {
  const {
    data: tokenData,
    isValidating: tokenDataLoading,
    error,
  } = useTokenData(chain, address)
  // if (tokenData && !tokenData?.displayInExplorer) return null

  return (
    <Link href={`/token/${chain}/${address}`} _hover={{ textDecoration: "none" }}>
      <DisplayCard
        title={
          !tokenData ? shortenHex(address, 4) : error ? "ERROR" : tokenData?.name
        }
        image={
          tokenData?.infoJSON?.icon
            ? `${process.env.NEXT_PUBLIC_FLEEK_BUCKET}/${chain}/${address}/${tokenData.infoJSON.icon}`
            : undefined
        }
      >
        <Wrap spacing={1.5}>
          <Tag bgColor="tokenxyz.rosybrown.100" color="tokenxyz.rosybrown.500">
            {chain}
          </Tag>
          <Tag bgColor="tokenxyz.rosybrown.100" color="tokenxyz.rosybrown.500">
            {!tokenDataLoading && tokenData?.symbol ? (
              `$${tokenData.symbol}`
            ) : (
              <Spinner size="xs" />
            )}
          </Tag>
          <Tag bgColor="tokenxyz.rosybrown.100" color="tokenxyz.rosybrown.500">
            {!tokenDataLoading && tokenData?.totalSupply ? (
              `Supply: ${tokenData.totalSupply}`
            ) : (
              <Spinner size="xs" />
            )}
          </Tag>
          <Tag bgColor="tokenxyz.rosybrown.100" color="tokenxyz.rosybrown.500">
            {tokenData && !tokenDataLoading ? (
              `${tokenData.infoJSON?.airdrops?.length || 0} airdrop${
                tokenData.infoJSON?.airdrops?.length > 1 ? "s" : ""
              }`
            ) : (
              <Spinner size="xs" />
            )}
          </Tag>

          <Tag bgColor="tokenxyz.rosybrown.100" color="tokenxyz.rosybrown.500">
            {tokenData && !tokenDataLoading ? (
              `${tokenData.infoJSON?.vestings?.length || 0} vesting${
                tokenData.infoJSON?.vestings?.length > 1 ? "s" : ""
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

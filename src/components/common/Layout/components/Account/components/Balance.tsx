import { Text } from "@chakra-ui/react"
import type { Token } from "types"
import { useBalance } from "wagmi"

type Props = {
  token: Token
}

const Balance = ({ token }: Props): JSX.Element => {
  const [{ data, loading }] = useBalance()

  const convertBalance = (): string => {
    let decimals = 0

    if (Number(data?.formatted) < 10) {
      decimals = 3
    } else if (Number(data?.formatted) < 100) {
      decimals = 2
    } else if (Number(data?.formatted) < 1000) {
      decimals = 1
    }

    if (token.decimals === 0) decimals = 0

    return Number(data?.formatted).toFixed(decimals)
  }

  return (
    <Text as="span" fontWeight="bold" fontSize="sm">
      {loading ? "Loading..." : `${convertBalance()} ${token.symbol}`}
    </Text>
  )
}

export default Balance

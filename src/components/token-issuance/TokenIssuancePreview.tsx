import { Tag, VStack } from "@chakra-ui/react"
import { chains } from "connectors"
import { useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { TokenIssuanceFormType } from "types"
import shortenHex from "utils/shortenHex"
import { useAccount } from "wagmi"

const TokenIssuancePreview = (): JSX.Element => {
  const [{ data: accountData }] = useAccount()
  const { control } = useFormContext<TokenIssuanceFormType>()

  const tokenTicker = useWatch({ control, name: "tokenTicker" })
  const economyModel = useWatch({ control, name: "economyModel" })
  const initialSupply = useWatch({ control, name: "initialSupply" })
  const maxSupply = useWatch({ control, name: "maxSupply" })
  const transferOwnershipTo = useWatch({ control, name: "transferOwnershipTo" })
  const chain = useWatch({ control, name: "chain" })

  const chainName = useMemo(
    () => (chain && chains ? chains.find((c) => c.id === chain)?.name : ""),
    [chains, chain]
  )

  if (!tokenTicker && !initialSupply) return null

  return (
    <VStack alignItems="start" spacing={1} fontSize="sm">
      <Tag size="sm" bgColor="tokenxyz.rosybrown.500" color="tokenxyz.white">
        Symbol: {tokenTicker ? `$${tokenTicker}` : "No symbol"}
      </Tag>
      <Tag size="sm" bgColor="tokenxyz.rosybrown.500" color="tokenxyz.white">
        Supply:{" "}
        {economyModel === "UNLIMITED"
          ? !isNaN(initialSupply) && Number(initialSupply).toLocaleString("en")
          : !isNaN(initialSupply) &&
            !isNaN(maxSupply) &&
            `${Number(initialSupply).toLocaleString("en")} - ${Number(
              maxSupply
            ).toLocaleString("en")}`}
      </Tag>
      <Tag size="sm" bgColor="tokenxyz.rosybrown.500" color="tokenxyz.white">
        Owner: {shortenHex(transferOwnershipTo || accountData?.address, 3)}
      </Tag>
      <Tag size="sm" bgColor="tokenxyz.rosybrown.500" color="tokenxyz.white">
        Chain: {chainName}
      </Tag>
    </VStack>
  )
}

export default TokenIssuancePreview

import { NULL_ADDRESS } from "connectors"
import { Contract, providers, utils } from "ethers"
import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import { TokenData } from "types"
import { erc20ABI } from "wagmi"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const handler = nextConnect({
  onError(error, _, res: NextApiResponse) {
    res.status(501).json({ error: `${error.message}` })
  },
})

// Fetching token data both from its contract and from IPFS, then combining them
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { chain: reqChain, address: reqAddress } = req.query
  const chainSlug = reqChain?.toString()?.toLowerCase()
  const address = reqAddress?.toString()?.toLowerCase()

  if (!chainSlug || !ADDRESS_REGEX.test(address))
    return res.status(400).json({ error: "Bad request. Invalid chain or address" })

  const provider = new providers.InfuraProvider(
    chainSlug,
    process.env.NEXT_PUBLIC_INFURA_ID
  )
  const tokenContract = new Contract(address, erc20ABI, provider)

  const data: TokenData = await Promise.all([
    tokenContract
      .queryFilter(tokenContract.filters.Transfer(NULL_ADDRESS))
      .then((events) => events?.[0]?.args?.to || null),
    tokenContract.symbol(),
    tokenContract.name(),
    tokenContract.decimals(),
    tokenContract.totalSupply(),
  ])
    .then(([owner, symbol, name, decimals, totalSupply]) => ({
      owner,
      symbol,
      name,
      decimals,
      totalSupply: Number(
        utils.formatUnits(totalSupply?.toString() || "0", decimals)
      ).toLocaleString("en"),
    }))
    .catch((_) => ({
      owner: null,
      symbol: null,
      name: null,
      decimals: null,
      totalSupply: null,
    }))

  if (!data?.symbol)
    return res.status(404).json({ error: "Not found. (Contract error)" })

  const infoJSON = await fetch(
    `${process.env.NEXT_PUBLIC_FLEEK_BUCKET}/${chainSlug}/${address}/info.json`
  )
    .then((fleekResponse) => fleekResponse.json())
    .catch((_) => null)

  // if (!infoJSON) return res.status(404).json({ error: "Not found. (IPFS error)" })
  if (!infoJSON) return res.json(data)

  const responseData: TokenData = {
    ...data,
    infoJSON,
  }

  return res.json(responseData)
})

export default handler

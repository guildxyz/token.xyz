import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"

const handler = nextConnect({
  onError(error, _, res: NextApiResponse) {
    res.status(501).json({ error: `${error.message}` })
  },
})

handler.get((req: NextApiRequest, res: NextApiResponse) =>
  fetch(
    `${process.env.NEXT_PUBLIC_FLEEK_BUCKET}/${req.query.chain}/${req.query.address}/info.json`
  )
    .then((response) =>
      response.ok
        ? response.json().then((tokenInfo) => res.json(tokenInfo))
        : res.status(response.status).json({ error: response.statusText })
    )
    .catch((_) => res.status(500).json({ error: "Could not get files from IPFS" }))
)

export default handler

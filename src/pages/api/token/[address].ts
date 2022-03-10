import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(501).json({
      message: `Method ${req.method} is not implemented for this endpoint`,
    })

  try {
    const pinataRes = await fetch(
      `https://api.pinata.cloud/data/pinList?status=pinned&metadata[name]=${req.query.address}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_ADMIN_JWT}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!pinataRes.ok)
      return res.status(pinataRes.status).json({ error: pinataRes.statusText })

    const json = await pinataRes.json()

    if (!json.count) return res.status(404).json({ error: "Not found" })

    const data = json.rows[0]
    const prettyData = {
      hash: data.ipfs_pin_hash,
      name: data.metadata.name,
      icon: data.metadata.keyvalues?.icon,
      airdrops: data.metadata.keyvalues?.airdrops?.split(","),
      vestings: data.metadata.keyvalues?.vestings?.split(","),
    }

    return res.json(prettyData)
  } catch (_) {
    return res.status(500).json({ error: "Could not fetch token data" })
  }
}

export default handler

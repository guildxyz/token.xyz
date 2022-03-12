import { upload as fleekUpload } from "@fleekhq/fleek-storage-js"
import multer from "multer"
import type { NextApiResponse } from "next"
import nextConnect from "next-connect"

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const fleekKeys = {
  apiKey: process.env.FLEEK_API_KEY,
  apiSecret: process.env.FLEEK_API_SECRET,
}

const handler = nextConnect({
  onError(error, _, res: NextApiResponse) {
    res.status(501).json({ error: `${error.message}` })
  },
})

// Using `fields` instead of `single`, so the user can submit a request without an image
handler.use(upload.fields([{ name: "icon", maxCount: 1 }]))

handler.post(
  (
    req: NextApiResponse & { body: Record<string, any>; files: Record<string, any> },
    res: NextApiResponse
  ) => {
    const uploadPromises = []

    const dirName = Object.entries(req.body).find(
      ([name, _]) => name === "dirName"
    )[1]

    if (Object.keys(req.body).length) {
      if (!Object.keys(req.body).find((key) => key === "dirName"))
        return res
          .status(400)
          .json({ error: "Bad request. Please specify a directory name." })

      const jsonFiles = Object.entries(req.body).filter(
        ([name, _]) => name !== "dirName"
      )

      jsonFiles.forEach(([name, content]) => {
        uploadPromises.push(
          fleekUpload({ ...fleekKeys, key: `${dirName}/${name}`, data: content })
        )
      })
    }

    if (req.files?.icon?.[0]) {
      uploadPromises.push(
        fleekUpload({
          ...fleekKeys,
          key: `${dirName}/icon.${req.files.icon[0].originalname
            ?.split(".")
            ?.pop()}`,
          data: req.files.icon[0].buffer,
        })
      )
    }

    Promise.all(uploadPromises)
      .then((fleekResponse) => res.json(fleekResponse))
      .catch((fleekError) => {
        if (typeof fleekError === "string")
          return res.status(500).json({ error: fleekError })
        return res.status(fleekError.statusCode).json({ error: fleekError.code })
      })
  }
)

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler

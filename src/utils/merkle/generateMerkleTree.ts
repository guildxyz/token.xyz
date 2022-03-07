import { utils } from "ethers"

const generateMerkleTree = (
  inputJSON: Array<{ address: string; amount: string }>
) => {
  const merkleTree: Record<string, string> = {}

  inputJSON.forEach((row) => {
    const { address, amount } = row
    const weiAmount = utils.parseEther(amount).toString()
    const hexAmount = BigInt(weiAmount).toString(16)

    merkleTree[address] = hexAmount
  })

  return merkleTree
}

export default generateMerkleTree

import etherscanApiEndpoints from "etherscanApiEndpoints"
import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import ERC20InitialSupplyInput from "static/standardJsonInputs/solc-input-erc20initialsupply.json"
import ERC20MintableAccesscontrolledInput from "static/standardJsonInputs/solc-input-erc20mintableaccesscontrolled.json"
import ERC20MintableAccesscontrolledMaxSupplyInput from "static/standardJsonInputs/solc-input-erc20mintableaccesscontrolledmaxsupply.json"
import ERC20MintableOwnedInput from "static/standardJsonInputs/solc-input-erc20mintableowned.json"
import ERC20MintableOwnedMaxSupplyInput from "static/standardJsonInputs/solc-input-erc20mintableownedmaxsupply.json"
import MerkleDistributorInput from "static/standardJsonInputs/solc-input-merkledistributor.json"
import MerkleVestingInput from "static/standardJsonInputs/solc-input-merklevesting.json"
import { ContractType, ContractTypeNamePairs } from "types"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const CONTRACT_JSON_INPUTS: Record<ContractType, Record<string, unknown>> = {
  erc20initialsupply: ERC20InitialSupplyInput,
  erc20mintableaccesscontrolled: ERC20MintableAccesscontrolledInput,
  erc20mintableaccesscontrolledmaxsupply:
    ERC20MintableAccesscontrolledMaxSupplyInput,
  erc20mintableowned: ERC20MintableOwnedInput,
  erc20mintableownedmaxsupply: ERC20MintableOwnedMaxSupplyInput,
  merkledistributor: MerkleDistributorInput,
  merklevesting: MerkleVestingInput,
}

const handler = nextConnect({
  onError(error, _, res: NextApiResponse) {
    res.status(501).json({ error: `${error.message}` })
  },
})

/**
 * Request params (sent in the req. body):
 *
 * - `chain`: 1 (ethereum), 3 (ropsten), 5 (goerli) (chain id's)
 * - `contractType`: ContractType
 * - `contractAddress`: a valid, 0x-prefixed, 42 characters long address
 * - `constructorArguments`: abi encoded constructor arguments
 */

handler.post((req: NextApiRequest, res: NextApiResponse) => {
  const data = JSON.parse(req.body)
  const { chain, contractType, contractAddress, constructorArguments } = data

  const apiUrl = etherscanApiEndpoints[chain]

  if (!apiUrl)
    return res.status(400).json({ error: "Bad request. Unsupported chain." })

  const sourceCode = CONTRACT_JSON_INPUTS[contractType]
  const contractName = ContractTypeNamePairs[contractType]

  if (!sourceCode || !contractName)
    return res.status(400).json({ error: "Bad request. Unsupported contract type" })

  if (!contractAddress || !ADDRESS_REGEX.test(contractAddress))
    return res
      .status(400)
      .json({ error: "Bad request. Please provide a valid contract address." })

  if (!constructorArguments)
    return res
      .status(400)
      .json({ error: "Bad request. Please provide constructor arguments." })

  const licenseType = contractType?.includes("erc20") ? "3" : "5"

  const body = new URLSearchParams()

  body.append("apikey", process.env.ETHERSCAN_API_KEY)
  body.append("module", "contract")
  body.append("action", "verifysourcecode")

  body.append("sourceCode", JSON.stringify(sourceCode))
  body.append("contractaddress", contractAddress)
  body.append("contractname", contractName)
  body.append("codeformat", "solidity-standard-json-input")
  body.append("compilerversion", "v0.8.13+commit.abaa5c0e")
  body.append("licenseType", licenseType)

  body.append("constructorArguments ", constructorArguments)

  return fetch(`${apiUrl}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })
    .then((etherscanResponse) => etherscanResponse.json())
    .then((json) => res.json(json))
})

export default handler

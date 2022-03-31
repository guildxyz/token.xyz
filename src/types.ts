import { BigNumber } from "ethers"

type WalletError = { code: number; message: string }

type Rest = {
  [x: string]: any
}

type Token = {
  address: string
  name: string
  symbol: string
  decimals: number
}

type TimelineSteps = Array<{
  title: string
  icon?: JSX.Element
  content: JSX.Element
  preview?: JSX.Element
}>

type TokenIssuanceFormType = {
  tokenName: string
  tokenTicker: string
  urlNameSelect: string
  urlName: string
  icon: File
  economyModel: "FIXED" | "UNLIMITED"
  initialSupply?: number
  maxSupply?: number
  transferOwnershipTo?: string
  decimals: number
  tokenType: "OWNABLE" | "ACCESS_CONTROL"
  chain: number // 1 | 3 | 5 | 56 | 137
  distributionData?: Array<AllocationFormType>
  correct: boolean
}

type VestingTypes = "DISTRIBUTE" | "NO_VESTING" | "LINEAR_VESTING" | "BOND_VESTING"

type AllocationFormType = {
  allocationName: string
  allocationCsv?: any
  allocationAddressesAmounts: Array<{ address: string; amount: string }>
  vestingType: VestingTypes
  distributionDuration?: number // In months
  vestingPeriod?: number // In months
  cliff?: number // In months
}

type TokenInfoJSON = {
  icon?: string
  chain?: number
  displayInExplorer?: boolean
  airdrops: Array<{ fileName: string; prettyUrl: string }>
  vestings: Array<{ fileName: string; prettyUrl: string }>
}

type AllocationJSON = {
  merkleRoot: string
  tokenTotal: string
  claims: Record<string, { index: number; amount: string; proof: Array<string> }>
  vestingType: VestingTypes
  distributionEnd: number
  vestingEnd?: number
  vestingPeriod?: number
  cliffPeriod?: number
  createdBy: string
  createdAt: number
  tokenAddress: string
  merkleDistributorContract?: string
  vestingContract?: string
  name: string
}

type ContractType =
  | "erc20initialsupply"
  | "erc20mintableaccesscontrolled"
  | "erc20mintableaccesscontrolledmaxsupply"
  | "erc20mintableowned"
  | "erc20mintableownedmaxsupply"
  | "merkledistributor"
  | "merklevesting"

enum ContractTypeNamePairs {
  erc20initialsupply = "/contracts/features/deployables/token/ERC20InitialSupply.sol:ERC20InitialSupply",
  erc20mintableaccesscontrolled = "/contracts/features/deployables/token/ERC20MintableAccessControlled.sol:ERC20MintableAccessControlled",
  erc20mintableaccesscontrolledmaxsupply = "/contracts/features/deployables/token/ERC20MintableAccessControlledMaxSupply.sol:ERC20MintableAccessControlledMaxSupply",
  erc20mintableowned = "/contracts/features/deployables/token/ERC20MintableOwned.sol:ERC20MintableOwned",
  erc20mintableownedmaxsupply = "/contracts/features/deployables/token/ERC20MintableOwnedMaxSupply.sol:ERC20MintableOwnedMaxSupply",
  merkledistributor = "/contracts/features/deployables/MerkleDistributor.sol:MerkleDistributor",
  merklevesting = "/contracts/features/deployables/MerkleVesting.sol:MerkleVesting",
}

type TokenData = {
  owner: string
  symbol: string
  name: string
  decimals: number
  totalSupply: BigNumber | string // Already formatted nicely
  infoJSON?: TokenInfoJSON
}

export type {
  WalletError,
  Rest,
  Token,
  TimelineSteps,
  VestingTypes,
  TokenIssuanceFormType,
  TokenInfoJSON,
  AllocationFormType,
  AllocationJSON,
  ContractType,
  TokenData,
}
export { ContractTypeNamePairs }

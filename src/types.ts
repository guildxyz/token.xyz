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
  urlName: string
  economyModel: "FIXED" | "UNLIMITED"
  initialSupply?: number
  maxSupply?: number
  transferOwnershipTo?: string
  mintable: boolean
  multiOwner: boolean
  canPause: boolean
  enableBlacklists: boolean
  decimals: number
  chain: "GOERLI" | "ETHEREUM"
  distributionData?: Array<AllocationFormType>
  correct: boolean
}

type VestingTypes = "NO_VESTING" | "LINEAR_VESTING" | "BOND_VESTING"

type AllocationFormType = {
  allocationName: string
  allocationCsv?: any
  allocationAddressesAmounts: Array<{ address: string; amount: string }>
  vestingType: VestingTypes
  distributionDuration?: number // In months
  vestingPeriod?: number // In months
  cliff?: number // In months
}

export type {
  WalletError,
  Rest,
  Token,
  TimelineSteps,
  VestingTypes,
  TokenIssuanceFormType,
}

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
  issuanceId: string
  inflationaryModel: "FIXED" | "MAX" | "UNLIMITED"
  initialSupply?: number
  maxSupply?: number
  transferOwnershipTo?: string
  canPause: boolean
  enableBlacklists: boolean
  decimals: number
  chain: "GOERLI" | "ETHEREUM"
  distributionData?: Array<AllocationFormType>
  correct: boolean
}

type AllocationFormType = {
  allocationName: string
  allocationCsv?: any
  allocationAddressesAmounts: Array<{ address: string; amount: string }>
  vestingType: "NO_VESTING" | "LINEAR_VESTING" | "BOND_VESTING"
  vestingPeriod?: number // In months
  cliff?: number // In months
}

export type { WalletError, Rest, Token, TimelineSteps, TokenIssuanceFormType }

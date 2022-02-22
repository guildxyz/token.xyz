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

export type { WalletError, Rest, Token, TimelineSteps }

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

export type { WalletError, Rest, Token }

export interface Profile {
  id: string
  uid: string
  email: string | null
  created_at: string
}

export interface Balance {
  id: number
  user_id: string
  token: string
  amount: string
}

export interface Transaction {
  id: number
  user_id: string
  type: 'deposit' | 'withdraw' | 'transfer'
  token: string
  amount: string
  status: string
  tx_hash: string | null
  created_at: string
}

export interface Withdrawal {
  id: number
  user_id: string
  token: string
  amount: string
  to_address: string
  status: string
  tx_hash: string | null
  requested_at: string
  processed_at: string | null
}

export interface DepositAddress {
  id: number
  user_id: string
  token: string
  address: string
  created_at: string
}

export interface CoinPrice {
  [key: string]: {
    usd: number
  }
}

export const SUPPORTED_TOKENS = ['BTC', 'ETH', 'USDT', 'USDC'] as const
export type SupportedToken = typeof SUPPORTED_TOKENS[number]

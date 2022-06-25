import { TransactionStream } from 'xrpl'

// Returned from ledger in `nft_buy_offers` and `nft_sell_offers`
export interface Offer {
  amount: string
  flags: number
  nft_offer_index: string
  owner: string
}

// Returned by GET `/api/tokens`
export interface Token {
  id: number
  content_id: number
  created_at: string
  updated_at: string
  title: string
  decoded_uri: string
  xrpl_token_id: string
  owner: string
  uri: string
  burned: boolean
}

// Returned by POST `/api/contents`
export interface Content {
  id: number
  payload: string
  title: string
  created_at: string
  updated_at: string
}

interface TokenTransaction {
  id: number
  token_id: number
  created_at: string
  updated_at: string
  payload: TransactionStream
}

// Returned by GET `/api/tokens/:id`
export interface TokenWithContent extends Token {
  content: Content
  transactions: TokenTransaction[]
}

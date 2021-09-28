interface ModifiedNode {
  ModifiedNode: {
    FinalFields: Array<Record<string, unknown>>
    LedgerEntryType: string
    LedgerIndex: string
    PreviousFields: Array<Record<string, unknown>>
    PreviousTxnID: string
    PreviousTxnLgrSeq: number
  }
}

// Returned from ledger when transaction validated
export interface LedgerTransactionResult {
  engine_result: string
  engine_result_code: number
  engine_result_message: string
  ledger_hash: string
  ledger_index: number
  meta: {
    AffectedNodes: ModifiedNode[]
    TransactionIndex: number
    TransactionResult: string
  }
  status: string
  transaction: Record<string, unknown>
  type: string
  validated: boolean
}

// Returned from ledger in `nft_buy_offers` and `nft_sell_offers`
export interface Offer {
  amount: string
  flags: number
  index: string
  owner: string
}

interface TokenPayload {
  transaction: {
    Fee: string
    URI: string
    hash: string
    Flags: number
    Account: string
    Sequence: number
    TokenTaxon: number
    TxnSignature: string
    SigningPubKey: string
    TransactionType: 'NFTokenMint'
    LastLedgerSequence: number
  }
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
  payload: LedgerTransactionResult
}

// Returned by GET `/api/tokens/:id`
export interface TokenWithContent extends Token {
  content: Content
  transactions: TokenTransaction[]
}

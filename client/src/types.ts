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

export interface Offer {
  amount: string
  flags: number
  index: string
  owner: string
}

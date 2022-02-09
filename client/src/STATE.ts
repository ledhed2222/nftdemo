import type { DeferredPromise } from './deferredPromise'
import type { LedgerTransactionResult } from './types'

export interface State {
  watchedTxHashes: Record<string, DeferredPromise<LedgerTransactionResult>>
  completedTxHashes: Record<string, LedgerTransactionResult>
}

const INITIAL_STATE: State = {
  watchedTxHashes: {},
  completedTxHashes: {},
}

/* eslint-disable import/no-mutable-exports --
 * TODO later */
let STATE = { ...INITIAL_STATE }
/* eslint-enable import/no-mutable-exports */

export const clearState = () => {
  STATE = { ...INITIAL_STATE }
}

export default STATE

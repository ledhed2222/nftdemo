import type { TransactionStream } from 'xrpl'

import type { DeferredPromise } from './lib/deferredPromise'

export interface State {
  watchedTxHashes: Record<string, DeferredPromise<TransactionStream>>
  completedTxHashes: Record<string, TransactionStream>
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

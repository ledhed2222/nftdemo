import axiosClient from './axiosClient'
import deferredPromise from './deferredPromise'
import STATE from './state'
import { LedgerTransactionResult } from './types'

const userSubmission = async (
  websocketUrl: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, _reject) => {
    const ws = new WebSocket(websocketUrl)
    ws.onmessage = (msg) => {
      const payload = JSON.parse(msg.data)
      if (payload.signed) {
        ws.close()
        resolve(payload)
      }
    }
  })
}

const completedTxResult = async (
  txHash: string,
): Promise<LedgerTransactionResult> => {
  if (STATE.completedTxHashes[txHash]) {
    return Promise.resolve(
      STATE.completedTxHashes[txHash] as LedgerTransactionResult,
    )
  }
  return Promise.reject()
}

const submit = async (
  payload: Record<string, unknown>,
): Promise<LedgerTransactionResult> => {
  const xummSubmitResponse = await axiosClient.request({
    method: 'post',
    url: '/api/xumm',
    data: { payload },
  })

  const xummWebsocketUrl = xummSubmitResponse.data.refs.websocket_status
  const signedPayload = await userSubmission(xummWebsocketUrl)

  const xummResult = (await axiosClient.request({
    method: 'get',
    url: `/api/xumm/${signedPayload.payload_uuidv4 as string}`,
  })) as any
  const txHash = xummResult.data.response.txid as string

  STATE.watchedTxHashes[txHash] = deferredPromise<LedgerTransactionResult>()
  const result = await Promise.any([
    completedTxResult(txHash),
    STATE.watchedTxHashes[txHash].promise,
  ])

  /* eslint-disable @typescript-eslint/no-dynamic-delete --
   * this is exactly what we want to do */
  delete STATE.watchedTxHashes[txHash]
  delete STATE.completedTxHashes[txHash]
  /* eslint-enable @typescript-eslint/no-dynamic-delete */

  return result
}

export default submit

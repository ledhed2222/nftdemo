import axiosClient from './axiosClient'
import deferredPromise from './deferredPromise'
import STATE from './STATE'
import { LedgerTransactionResult } from './types'

export const requestSignature = async (
  payload: Record<string, unknown>,
): Promise<Record<string, any>> => {
  return (
    await axiosClient.request({
      method: 'post',
      url: '/api/xumm',
      data: { payload },
    })
  ).data
}

export const signatureResult = async (
  websocketUrl: string,
): Promise<Record<string, any>> => {
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

export const confirmedLedgerTx = async (
  payloadUuid: string,
): Promise<LedgerTransactionResult> => {
  const xummResult = (await axiosClient.request({
    method: 'get',
    url: `/api/xumm/${payloadUuid}`,
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

export const submit = async (
  payload: Record<string, unknown>,
): Promise<LedgerTransactionResult> => {
  const xummSubmitResponse = await requestSignature(payload)

  const xummWebsocketUrl = xummSubmitResponse.refs.websocket_status
  const signedPayload = await signatureResult(xummWebsocketUrl)
  const result = await confirmedLedgerTx(signedPayload.payload_uuidv4)
  return result
}

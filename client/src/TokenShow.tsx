import { RippleAPI, TransactionJSON } from '@ledhed2222/ripple-lib'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { ISSUER_SEED } from './CreateForm'
import Identicon from './Identicon'
import { Token } from './TokenList'

import './TokenShow.css'

interface Props {
  client: RippleAPI
}
interface Params {
  id: string
}

interface TokenResponse {
  content: {
    id: number
    payload: string
    title: string
    created_at: string
    updated_at: string
  }
  token: Token
}

const TokenShow = ({ client }: Props) => {
  const [tokenContent, setTokenContent] = useState<TokenResponse | null>(null)
  const { id } = useParams<Params>()
  const historyRouter = useHistory()

  useEffect(() => {
    const loadToken = async () => {
      const response = await axios({
        method: 'get',
        url: `/api/contents/${id}`,
      })
      setTokenContent(response.data)
    }
    loadToken()
  }, [id])

  const signAndSend = async (transaction: TransactionJSON) => {
    const preparedTransaction = await client.prepareTransaction(transaction)
    const signedTransaction = client.sign(
      preparedTransaction.txJSON,
      ISSUER_SEED,
    )
    const transactionResponse = await client.request('submit', {
      tx_blob: signedTransaction.signedTransaction,
    })
  }

  const burnToken = async () => {
    if (
      !window.confirm(
        "Are you sure you wish to permanently delete this token? This action can't be undone.",
      ) ||
      tokenContent == null
    ) {
      return
    }

    const burnTx = {
      TransactionType: 'NFTokenBurn',
      Account: tokenContent.token.payload.tx_json.Account,
      TokenID: tokenContent.token.token_id,
    }

    await signAndSend(burnTx)

    await axios({
      method: 'delete',
      url: `/api/tokens/${tokenContent.token.id}`,
    })

    historyRouter.push('/tokens')
  }

  return (
    <div className="TokenShow">
      {tokenContent && (
        <Identicon value={`${tokenContent.token.payload.tx_json.hash}`} />
      )}
      <button type="button" onClick={burnToken}>
        Burn Token
      </button>
      Content:
      <div className="TokenContent">{tokenContent?.content?.payload}</div>
      Raw:
      <pre>{JSON.stringify(tokenContent, null, 2)}</pre>
    </div>
  )
}

export default TokenShow

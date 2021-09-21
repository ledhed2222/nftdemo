import { RippleAPI, TransactionJSON } from '@ledhed2222/ripple-lib'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { ISSUER_SEED } from './CreateForm'
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

interface TxResponse {
  meta: {
    AffectedNodes: [
      {
        ModifiedNode: {
          FinalFields: {
            NonFungibleTokens: Array<{
              NonFungibleToken: {
                TokenID: string
                URI: string
              }
            }>
          }
        }
      },
    ]
  }
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
    const secret = ISSUER_SEED
    const preparedTransaction = await client.prepareTransaction(transaction)
    const signedTransaction = client.sign(preparedTransaction.txJSON, secret)
    const transactionResponse = await client.request('submit', {
      tx_blob: signedTransaction.signedTransaction,
    })
  }

  const getTokenID = async () => {
    if (tokenContent == null) {
      throw Error('tokenContent is null')
    }

    const txResponse: TxResponse = await client.request('tx', {
      transaction: tokenContent.token.payload.hash,
    })

    const NonFungibleTokens =
      txResponse.meta.AffectedNodes[0].ModifiedNode.FinalFields
        .NonFungibleTokens

    const TokenID = NonFungibleTokens.find(
      (token) => token.NonFungibleToken.URI === tokenContent.token.payload.URI,
    )?.NonFungibleToken.TokenID

    return TokenID
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
      Account: tokenContent.token.payload.Account,
      TokenID: await getTokenID(),
    }

    await signAndSend(burnTx)

    // TODO uncomment when burning route is available
    // const response = await axios({
    //   method: 'delete',
    //   url: `/api/contents/${id}`,
    // })

    historyRouter.push('/tokens')
  }

  return (
    <div className="TokenShow">
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

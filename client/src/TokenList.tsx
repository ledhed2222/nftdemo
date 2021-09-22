import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import './TokenList.css'

interface TokenPayload {
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

export interface Token {
  id: number
  payload: TokenPayload
  content_id: number
  created_at: string
  updated_at: string
  title: string
  decoded_uri: string
  token_id: string
}

const TokenList = () => {
  const [tokens, setTokens] = useState<Token[]>([])

  useEffect(() => {
    const loadTokens = async () => {
      const response = await axios({
        method: 'get',
        url: '/api/tokens',
      })
      const newTokens = response.data as Token[]
      setTokens(newTokens)
    }
    loadTokens()
  }, [])

  return (
    <div className="TokenList">
      <ul>
        {tokens.map((token) => (
          <li key={token.id} className="Token">
            <div className="TokenField">
              <span className="FieldName">Title</span>
              <span className="FieldValue">&nbsp;{token.title}</span>
            </div>
            <div className="TokenField">
              <span className="FieldName">Token ID</span>
              <span className="FieldValue">&nbsp;{token.token_id}</span>
            </div>
            <div className="TokenField">
              <span className="FieldName">URI</span>
              <span className="FieldValue">
                &nbsp;
                <Link to={new URL(token.decoded_uri).pathname}>
                  {token.decoded_uri}
                </Link>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TokenList

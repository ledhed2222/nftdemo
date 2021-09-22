import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GridLoader } from 'react-spinners'

import './TokenList.css'

interface TokenPayload {
  tx_json: {
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

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
}

const TokenList = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadTokens = async () => {
      const response = await axios({
        method: 'get',
        url: '/api/tokens',
      })
      const newTokens = response.data as Token[]
      setTokens(newTokens)
      setIsLoading(false)
    }
    loadTokens()
  }, [])

  return (
    <div className="TokenList">
      <div style={loaderStyle}>
        <GridLoader color="white" loading={isLoading} />
      </div>
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

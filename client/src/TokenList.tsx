import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { GridLoader } from 'react-spinners'
import Alert from '@mui/material/Alert'

import axiosClient from './axiosClient'
import Tokens from './components/Tokens'

import './TokenList.css'

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

export interface Token {
  id: number
  payload: TokenPayload
  content_id: number
  created_at: string
  updated_at: string
  title: string
  decoded_uri: string
  token_id: string
  owner: string
}

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
}

const TokenList = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isBurnSuccess, setIsBurnSuccess] = useState<boolean>(false)
  const [burnedTokenTitle, setBurnedTokenTitle] = useState<string>()
  const historyRouter = useHistory()
  const { state }: any = useLocation<Location>()

  useEffect(() => {
    const loadTokens = async () => {
      const response = await axiosClient.request({
        method: 'get',
        url: '/api/tokens',
      })
      const newTokens = response.data as Token[]
      setTokens(newTokens)
      setIsLoading(false)

      if (state?.isBurnSuccess) {
        setIsBurnSuccess(state.isBurnSuccess)
        setBurnedTokenTitle(state.burnedTokenTitle)
        historyRouter.replace({})
      }
    }
    loadTokens()
  }, [])

  return (
    <div className="TokenList">
      {isBurnSuccess && (
        <Alert
          onClose={() => setIsBurnSuccess(false)}
          sx={{ maxWidth: '300px', margin: '0 auto', marginBottom: 5 }}
        >
          Token Burned: {burnedTokenTitle}
        </Alert>
      )}
      <div style={loaderStyle}>
        <GridLoader color="black" loading={isLoading} />
      </div>
      <Tokens tokens={tokens} />
    </div>
  )
}

export default TokenList

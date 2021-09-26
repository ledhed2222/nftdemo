import React, { useState, useEffect, useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { GridLoader } from 'react-spinners'
import Alert from '@mui/material/Alert'

import axiosClient from './axiosClient'
import MyTokens from './MyTokens'

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

const MyTokensList = () => {
  const { myTokens } = useContext(MyTokens)
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isBurnSuccess, setIsBurnSuccess] = useState<boolean>(false)
  const [burnedTokenTitle, setBurnedTokenTitle] = useState<string>()
  const historyRouter = useHistory()
  const { state }: any = useLocation<Location>()

  useEffect(() => {
    const loadTokens = async () => {
      if (Object.keys(myTokens).length === 0) {
        return
      }
      setIsLoading(true)

      const response = await axiosClient.request({
        method: 'get',
        url: '/api/tokens',
      })
      const newTokens = (response.data as Token[]).filter(
        (token) => token.token_id in myTokens,
      )

      setTokens(newTokens)
      setIsLoading(false)

      if (state?.isBurnSuccess) {
        setIsBurnSuccess(state.isBurnSuccess)
        setBurnedTokenTitle(state.burnedTokenTitle)
        historyRouter.replace({})
      }
    }
    loadTokens()
  }, [myTokens])

  return (
    <div className="MyTokensList">
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

export default MyTokensList

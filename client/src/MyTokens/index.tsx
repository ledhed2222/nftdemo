import Alert from '@mui/material/Alert'
import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useHistory, useLocation } from 'react-router-dom'
import { GridLoader } from 'react-spinners'

import Tokens from '../components/Tokens'
import axiosClient from '../lib/axiosClient'
import type { Token } from '../types'

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
}

const MyTokens = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>('')
  const historyRouter = useHistory()
  const { state }: any = useLocation<Location>()
  const [{ account }] = useCookies(['account'])

  const loadTokens = async () => {
    setIsLoading(true)
    const response = await axiosClient.request({
      method: 'get',
      url: `/api/tokens?owner=${account}`,
    })
    setTokens(response.data)
    setIsLoading(false)
  }

  useEffect(() => {
    if (state?.alertMessage) {
      setAlertMessage(state.alertMessage)
      historyRouter.replace({})
    }
  }, [])

  useEffect(() => {
    if (account == null) {
      setTokens([])
      return
    }
    loadTokens()
  }, [account])

  return (
    <div className="MyTokens">
      {alertMessage.length > 0 && (
        <Alert
          onClose={() => setAlertMessage('')}
          sx={{ maxWidth: '300px', margin: '0 auto', marginBottom: 5 }}
        >
          {alertMessage}
        </Alert>
      )}
      <div style={loaderStyle}>
        <GridLoader color="black" loading={isLoading} />
      </div>
      <Tokens tokens={tokens} />
    </div>
  )
}

export default MyTokens

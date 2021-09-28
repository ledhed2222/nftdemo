import React, { useState, useEffect } from 'react'
import { GridLoader } from 'react-spinners'

import axiosClient from './axiosClient'
import Tokens from './components/Tokens'

import type { Token } from './types'

import './TokenList.css'

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
}

const TokenList = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadTokens = async () => {
      const response = await axiosClient.request({
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
        <GridLoader color="black" loading={isLoading} />
      </div>
      <Tokens tokens={tokens} />
    </div>
  )
}

export default TokenList

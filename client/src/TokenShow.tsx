import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { Token } from './TokenList'

import './TokenShow.css'

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

const TokenShow = () => {
  const [tokenContent, setTokenContent] = useState<TokenResponse | null>(null)
  const { id } = useParams<Params>()

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

  return (
    <div className="TokenShow">
      Content:
      <div className="TokenContent">{tokenContent?.content?.payload}</div>
      Raw:
      <pre>{JSON.stringify(tokenContent, null, 2)}</pre>
    </div>
  )
}

export default TokenShow

import { RippleAPI, TransactionJSON } from '@ledhed2222/ripple-lib'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import React, { useState, useEffect, useContext } from 'react'
import ReactJson from 'react-json-view'
import { useParams } from 'react-router-dom'
import { PulseLoader } from 'react-spinners'
import { useCookies } from 'react-cookie'

import axiosClient from '../axiosClient'
import Identicon from '../Identicon'
import { Token } from '../TokenList'
import submit from '../xumm'
import MyTokens from '../MyTokens'

import BurnToken from './BurnToken'
import BuyOffer from './BuyOffer'
import SellOffer from './SellOffer'
import TokenOffers from './TokenOffers'

import './index.css'

interface Props {
  client: RippleAPI | null
}

interface Params {
  id: string
}

export interface TokenResponse extends Token {
  content: {
    id: number
    payload: string
    title: string
    created_at: string
    updated_at: string
  }
}

const TokenShow = ({ client }: Props) => {
  const [token, setToken] = useState<TokenResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { id } = useParams<Params>()
  const [cookies] = useCookies(['account'])
  const account = cookies.account
  const isMyToken = token && account && token.owner === account

  useEffect(() => {
    const loadToken = async () => {
      setIsLoading(true)
      const response = await axiosClient.request({
        method: 'get',
        url: `/api/tokens/${id}`,
      })
      setToken(response.data)
      setIsLoading(false)
    }
    loadToken()
  }, [id])

  return (
    <div className="TokenShow">
      <PulseLoader
        color="black"
        loading={isLoading}
        size={20}
        speedMultiplier={0.75}
      />
      {client && token && (
        <Card sx={{ boxShadow: 2 }}>
          <CardHeader
            avatar={<Identicon value={token.payload.transaction.hash} />}
            title={token.title}
            subheader={token.token_id}
            sx={{ background: '#e6e6e6' }}
          />
          <Divider />
          <CardActions>
            {!isMyToken && <BuyOffer token={token} account={account} />}
            {isMyToken && <SellOffer token={token} account={account} />}
            {isMyToken && <BurnToken token={token} account={account} />}
          </CardActions>
          <Divider />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Content
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <div className="TokenContent">{token.content.payload}</div>
            </Typography>
            <TokenOffers token={token} client={client} account={account} />
            <Typography gutterBottom variant="h5" component="div">
              Raw
            </Typography>
            <Box sx={{ boxShadow: 3 }}>
              <ReactJson
                src={token}
                displayObjectSize={false}
                displayDataTypes={false}
                collapseStringsAfterLength={120}
                theme="chalk"
              />
            </Box>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default TokenShow

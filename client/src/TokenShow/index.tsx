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
import submit from '../xumm'

import type { TokenWithContent, Offer } from '../types'

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

const TokenShow = ({ client }: Props) => {
  const [token, setToken] = useState<TokenWithContent | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [buyOffers, setBuyOffers] = useState<Offer[]>([])
  const [sellOffers, setSellOffers] = useState<Offer[]>([])
  const { id } = useParams<Params>()
  const [{ account }] = useCookies(['account'])
  const isLoggedIn = account != null
  const isMyToken = token && account && token.owner === account

  const doLoadToken = async () => {
    setIsLoading(true)
    const response = await axiosClient.request({
      method: 'get',
      url: `/api/tokens/${id}`,
    })
    setToken(response.data)
    setIsLoading(false)
  }

  const loadBuyOffers = async () => {
    if (!token || !client?.isConnected()) {
      return
    }
    try {
      const { offers } = await client.request('nft_buy_offers', {
        tokenid: token.xrpl_token_id,
      })
      setBuyOffers(offers)
    } catch (_error) {
      setBuyOffers([])
    }
  }

  const loadSellOffers = async () => {
    if (!token || !client?.isConnected()) {
      return
    }
    try {
      const { offers } = await client.request('nft_sell_offers', {
        tokenid: token.xrpl_token_id,
      })
      setSellOffers(offers)
    } catch (_error) {
      setSellOffers([])
    }
  }

  const doLoadOffers = async () => {
    setIsLoading(true)
    await Promise.all([loadBuyOffers(), loadSellOffers()])
    setIsLoading(false)
  }

  useEffect(() => {
    doLoadToken()
  }, [id])

  useEffect(() => {
    doLoadOffers()
  }, [token, client])

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
            avatar={<Identicon value={token.xrpl_token_id} />}
            title={token.title}
            subheader={
              token.burned ? 'Burnt' : `Token ID: ${token.xrpl_token_id}`
            }
            sx={{ background: '#e6e6e6' }}
          />
          <Divider />
          {!token.burned && isLoggedIn && (
            <CardActions>
              {!isMyToken && (
                <BuyOffer
                  onOffer={doLoadOffers}
                  token={token}
                  account={account}
                />
              )}
              {isMyToken && (
                <SellOffer
                  onOffer={doLoadOffers}
                  token={token}
                  account={account}
                />
              )}
              {isMyToken && <BurnToken token={token} account={account} />}
            </CardActions>
          )}
          <Divider />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Content
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <div className="TokenContent">{token.content.payload}</div>
            </Typography>
          </CardContent>
          <Divider />
          <CardContent>
            <TokenOffers
              token={token}
              account={account}
              sellOffers={sellOffers}
              buyOffers={buyOffers}
              onAcceptOffer={doLoadToken}
            />
          </CardContent>
          <Divider />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Transactions
            </Typography>
            {token.transactions.map((transaction) => (
              <>
                <Typography gutterBottom variant="h6" component="div">
                  {(transaction as any).payload.transaction.TransactionType}
                </Typography>
                <Box sx={{ boxShadow: 3 }}>
                  <ReactJson
                    src={transaction.payload}
                    displayObjectSize={false}
                    displayDataTypes={false}
                    collapseStringsAfterLength={120}
                    collapsed={1}
                    name={null}
                    theme="chalk"
                  />
                </Box>
              </>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default TokenShow

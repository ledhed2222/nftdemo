import { RippleAPI } from '@ledhed2222/ripple-lib'
import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import { PulseLoader } from 'react-spinners'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

import AcceptOffer from './AcceptOffer'

import type { Offer } from '../types'

import type { TokenResponse } from './index'

interface Props {
  token: TokenResponse
  client: RippleAPI
  account: string
}

const TokenOffers = ({ account, token, client }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [buyOffers, setBuyOffers] = useState<Offer[]>([])
  const [sellOffers, setSellOffers] = useState<Offer[]>([])
  const isMyToken = token && account && token.owner === account

  const loadBuyOffers = async () => {
    try {
      // TODO lol these are backwards in nik's implementation
      const { offers } = await client.request('nft_sell_offers', {
        tokenid: token.token_id,
      })
      setBuyOffers(offers)
    } catch(_error) {
      setBuyOffers([])
    }
  }

  const loadSellOffers = async () => {
    try {
      // TODO lol these are backwards in nik's implementation
      const { offers } = await client.request('nft_buy_offers', {
        tokenid: token.token_id,
      })
      setSellOffers(offers)
    } catch(_error) {
      setSellOffers([])
    }
  }

  const loadOffers = async () => {
    setIsLoading(true)
    await Promise.all([
      loadBuyOffers(),
      loadSellOffers(),
    ])
    setIsLoading(false)
  }

  useEffect(() => {
    loadOffers()
  }, [])

  return (
    <Typography gutterBottom variant="h5" component="div">
      Offers
      <PulseLoader
        color="black"
        loading={isLoading}
        size={20}
        speedMultiplier={0.75}
      />
      <Typography gutterBottom variant="h6" component="div">
        Sell Side
        <List>
          {sellOffers.map((offer) => (
            <ListItem key={offer.index}>
              <ListItemText primary={`XRP ${offer.amount}`} />
              <ListItemText primary={`From ${offer.owner}`} />
              { !isMyToken &&
                <AcceptOffer offer={offer} mode="sell" />
              }
            </ListItem>
          ))}
        </List>
      </Typography>
      <Typography gutterBottom variant="h6" component="div">
        Buy Side
        <List>
          {buyOffers.map((offer) => (
            <ListItem key={offer.index}>
              <ListItemText primary={`XRP ${offer.amount}`} />
              <ListItemText primary={`From ${offer.owner}`} />
              { isMyToken &&
                <AcceptOffer offer={offer} mode="buy" />
              }
            </ListItem>
          ))}
        </List>
      </Typography>
    </Typography>
  )
}

export default TokenOffers

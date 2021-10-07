import { dropsToXrp } from '@ledhed2222/ripple-lib'
import React from 'react'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

import AcceptOffer from './AcceptOffer'

import type { TokenWithContent, Offer } from '../types'

interface Props {
  onAcceptOffer: () => Promise<void>
  token: TokenWithContent
  sellOffers: Offer[]
  buyOffers: Offer[]
  account: string
}

const TokenOffers = ({
  onAcceptOffer,
  account,
  token,
  sellOffers,
  buyOffers,
}: Props) => {
  const isLoggedIn = account != null
  const isMyToken = token && account && token.owner === account

  return (
    <Typography gutterBottom variant="h5" component="div">
      Offers
      <Typography gutterBottom variant="h6" component="div">
        Sell Side
        <List>
          {sellOffers.map((offer) => (
            <ListItem key={offer.index}>
              <ListItemText primary={`XRP ${dropsToXrp(offer.amount)}`} />
              <ListItemText primary={`From ${offer.owner}`} />
              {isLoggedIn && !isMyToken && (
                <AcceptOffer
                  onAccept={onAcceptOffer}
                  token={token}
                  offer={offer}
                  mode="sell"
                />
              )}
            </ListItem>
          ))}
        </List>
      </Typography>
      <Typography gutterBottom variant="h6" component="div">
        Buy Side
        <List>
          {buyOffers.map((offer) => (
            <ListItem key={offer.index}>
              <ListItemText primary={`XRP ${dropsToXrp(offer.amount)}`} />
              <ListItemText primary={`From ${offer.owner}`} />
              {isLoggedIn && isMyToken && (
                <AcceptOffer
                  onAccept={onAcceptOffer}
                  token={token}
                  offer={offer}
                  mode="buy"
                />
              )}
            </ListItem>
          ))}
        </List>
      </Typography>
    </Typography>
  )
}

export default TokenOffers

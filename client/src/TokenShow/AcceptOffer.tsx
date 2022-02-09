import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { PulseLoader } from 'react-spinners'
import { useCookies } from 'react-cookie'
import { useHistory } from 'react-router-dom'
import { dropsToXrp } from 'xrpl'

import axiosClient from '../axiosClient'
import { submit } from '../xumm'

import type { TokenWithContent, Offer } from '../types'

interface Props {
  onAccept: () => Promise<void>
  offer: Offer
  mode: 'sell' | 'buy'
  token: TokenWithContent
}

const AcceptOffer = ({ onAccept, token, offer, mode }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [{ account }] = useCookies(['account'])
  const historyRouter = useHistory()

  const acceptOffer = async () => {
    setIsLoading(true)

    const acceptOfferTx = {
      TransactionType: 'NFTokenAcceptOffer',
      [mode === 'sell' ? 'SellOffer' : 'BuyOffer']: offer.index,
    }
    const txResult = await submit(acceptOfferTx)
    await Promise.all([
      axiosClient.request({
        method: 'post',
        url: '/api/token_transactions',
        data: {
          token_id: token.id,
          payload: txResult,
        },
      }),
      axiosClient.request({
        method: 'patch',
        url: `/api/tokens/${token.id}/change_owner`,
        data: {
          owner: account,
        },
      }),
    ])

    onAccept()
    setIsLoading(false)
    setIsDialogOpen(false)
    historyRouter.push('/my-tokens', {
      alertMessage: `Token Bought: ${token.title}`,
    })
  }

  return (
    <IconButton aria-label="make buy offer">
      <Button
        sx={{ background: 'white' }}
        variant="outlined"
        color="primary"
        onClick={() => setIsDialogOpen(true)}
      >
        Accept Offer
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Accept Offer</DialogTitle>
          <DialogContent>Accept offer of XRP {dropsToXrp(offer.amount)}?</DialogContent>
          <DialogActions>
            <PulseLoader
              color="black"
              loading={isLoading}
              size={20}
              speedMultiplier={0.75}
            />
            <Button color="error" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={acceptOffer}
              autoFocus
            >
              Accept
            </Button>
          </DialogActions>
        </Dialog>
      </Button>
    </IconButton>
  )
}

export default AcceptOffer

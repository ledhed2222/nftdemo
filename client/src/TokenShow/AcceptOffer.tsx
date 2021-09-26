import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PulseLoader } from 'react-spinners'

import submit from '../xumm'

import type { Offer } from '../types'

interface Props {
  offer: Offer
  mode: 'sell' | 'buy'
}

const AcceptOffer = ({ offer, mode }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const acceptOffer = async () => {
    setIsLoading(true)

    const acceptOfferTx = {
      TransactionType: 'NFTokenAcceptOffer',
      [mode === 'sell' ? 'SellOffer' : 'BuyOffer']: offer.index,
    }
    await submit(acceptOfferTx)

    setIsLoading(false)
    setIsDialogOpen(false)
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
          <DialogTitle id="alert-dialog-title">
            Accept Offer
          </DialogTitle>
          <DialogContent>
            Accept offer of XRP {offer.amount}?
          </DialogContent>
          <DialogActions>
            <PulseLoader
              color="black"
              loading={isLoading}
              size={20}
              speedMultiplier={0.75}
            />
            <Button
              color="error"
              onClick={() => setIsDialogOpen(false)}
            >
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

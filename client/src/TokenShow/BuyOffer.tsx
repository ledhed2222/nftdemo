import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import React, { useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { xrpToDrops } from 'xrpl'

import axiosClient from '../lib/axiosClient'
import { submit } from '../lib/xumm'
import type { TokenWithContent } from '../types'

interface Props {
  onOffer: () => Promise<void>
  token: TokenWithContent
  account: string
}

const BuyOffer = ({ account, token, onOffer }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [amount, setAmount] = useState<number | null>(null)

  const onAmountChange = (evn: React.ChangeEvent<HTMLInputElement>) => {
    evn.preventDefault()
    setAmount(parseInt(evn.target.value, 10))
  }

  const buyOffer = async () => {
    if (amount == null) {
      return
    }
    setIsLoading(true)

    const buyOfferTx = {
      TransactionType: 'NFTokenCreateOffer',
      Account: account,
      Flags: 0, // buy offer
      TokenID: token.xrpl_token_id,
      Amount: `${xrpToDrops(amount)}`,
      Owner: token.owner,
    }
    const txResult = await submit(buyOfferTx)
    await axiosClient.request({
      method: 'post',
      url: '/api/token_transactions',
      data: {
        token_id: token.id,
        payload: txResult,
      },
    })

    onOffer()
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
        Make Buy Offer
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Make Buy Offer</DialogTitle>
          <DialogContent>
            <input
              type="number"
              min="1"
              onChange={onAmountChange}
              value={amount ?? `${amount}`}
            />
          </DialogContent>
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
              onClick={buyOffer}
              autoFocus
              disabled={amount == null}
            >
              Offer
            </Button>
          </DialogActions>
        </Dialog>
      </Button>
    </IconButton>
  )
}

export default BuyOffer

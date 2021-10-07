import { xrpToDrops } from '@ledhed2222/ripple-lib'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import IconButton from '@mui/material/IconButton'
import DialogTitle from '@mui/material/DialogTitle'
import { PulseLoader } from 'react-spinners'

import axiosClient from '../axiosClient'
import submit from '../xumm'

import type { TokenWithContent } from '../types'

interface Props {
  onOffer: () => Promise<void>
  token: TokenWithContent
  account: string
}

const SellOffer = ({ account, token, onOffer }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [amount, setAmount] = useState<number | null>(null)

  const onAmountChange = (evn: React.ChangeEvent<HTMLInputElement>) => {
    evn.preventDefault()
    setAmount(parseInt(evn.target.value, 10))
  }

  const sellOffer = async () => {
    if (amount == null) {
      return
    }
    setIsLoading(true)

    const sellOfferTx = {
      TransactionType: 'NFTokenCreateOffer',
      Account: account,
      Flags: 1, // sell offer
      TokenID: token.xrpl_token_id,
      Amount: `${xrpToDrops(amount)}`,
    }
    const txResult = await submit(sellOfferTx)
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
    <IconButton aria-label="make sell offer">
      <Button
        sx={{ background: 'white' }}
        variant="outlined"
        color="primary"
        onClick={() => setIsDialogOpen(true)}
      >
        Make Sell Offer
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Make Sell Offer</DialogTitle>
          <DialogContent>
            <input type="number" min="1" onChange={onAmountChange} value={amount ?? `${amount}`} />
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
              onClick={sellOffer}
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

export default SellOffer

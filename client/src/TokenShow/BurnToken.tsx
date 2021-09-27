import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import IconButton from '@mui/material/IconButton'
import DialogTitle from '@mui/material/DialogTitle'
import { useHistory } from 'react-router-dom'
import { PulseLoader } from 'react-spinners'

import axiosClient from '../axiosClient'
import submit from '../xumm'

import type { TokenResponse } from './index'

interface Props {
  token: TokenResponse
  account: string
}

const BurnToken = ({ account, token }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const historyRouter = useHistory()

  const burnToken = async () => {
    setIsLoading(true)

    const burnTx = {
      TransactionType: 'NFTokenBurn',
      Account: account,
      TokenID: token.token_id,
    }
    await submit(burnTx)
    await axiosClient.request({
      method: 'delete',
      url: `/api/tokens/${token.id}`,
    })

    setIsLoading(false)
    setIsDialogOpen(false)

    historyRouter.push('/my-tokens', {
      burnedTokenTitle: token.title,
      isBurnSuccess: true,
    })
  }

  return (
    <IconButton aria-label="burn token">
      <Button
        sx={{ background: 'white' }}
        variant="outlined"
        color="error"
        onClick={() => setIsDialogOpen(true)}
      >
        Burn Token
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Burn token?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you wish to permanently delete this token?
              <br />
              This action can&apos;t be undone.
            </DialogContentText>
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
              onClick={burnToken}
              autoFocus
            >
              Burn
            </Button>
          </DialogActions>
        </Dialog>
      </Button>
    </IconButton>
  )
}

export default BurnToken

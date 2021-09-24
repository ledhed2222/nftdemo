import { RippleAPI, TransactionJSON } from '@ledhed2222/ripple-lib'
import axios from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react'
import ReactJson from 'react-json-view'
import { useHistory, useParams } from 'react-router-dom'
import { PulseLoader } from 'react-spinners'

import { ISSUER_SEED } from './CreateForm'
import Identicon from './Identicon'
import { Token } from './TokenList'

import './TokenShow.css'

interface Props {
  client: RippleAPI
}
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

const TokenShow = ({ client }: Props) => {
  const [tokenContent, setTokenContent] = useState<TokenResponse | null>(null)
  const [isBurnDialogOpen, setIsBurnDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { id } = useParams<Params>()
  const historyRouter = useHistory()

  useEffect(() => {
    const loadToken = async () => {
      setIsLoading(true)
      const response = await axios({
        method: 'get',
        url: `/api/contents/${id}`,
      })
      setTokenContent(response.data)
      setIsLoading(false)
    }
    loadToken()
  }, [id])

  const signAndSend = async (transaction: TransactionJSON) => {
    const preparedTransaction = await client.prepareTransaction(transaction)
    const signedTransaction = client.sign(
      preparedTransaction.txJSON,
      ISSUER_SEED,
    )
    const transactionResponse = await client.request('submit', {
      tx_blob: signedTransaction.signedTransaction,
    })
  }

  const burnToken = async () => {
    if (tokenContent == null) {
      return
    }

    setIsLoading(true)

    const burnTx = {
      TransactionType: 'NFTokenBurn',
      Account: tokenContent.token.payload.tx_json.Account,
      TokenID: tokenContent.token.token_id,
    }

    await signAndSend(burnTx)

    await axios({
      method: 'delete',
      url: `/api/tokens/${tokenContent.token.id}`,
    })

    setIsLoading(false)
    setIsBurnDialogOpen(false)

    historyRouter.push(
      '/tokens', 
      { burnedTokenTitle: tokenContent?.token.title, isBurnSuccess: true },
    )
  }

  return (
    <div className="TokenShow">
      <PulseLoader
        color="black"
        loading={isLoading && !isBurnDialogOpen}
        size={20}
        speedMultiplier={0.75}
      />
      <Card sx={{ boxShadow: 2 }}>
        <CardHeader
          avatar={
            tokenContent && <Identicon value={tokenContent.token.payload.tx_json.hash} />
          }
          action={
            <IconButton aria-label="settings">
              <Button
                sx={{ background: 'white' }}
                variant="outlined"
                color="error"
                onClick={() => setIsBurnDialogOpen(true)}
              >
                Burn Token
              </Button>
            </IconButton>
          }
          title={tokenContent?.token.title}
          subheader={tokenContent?.token.token_id}
          sx={{ background: '#e6e6e6' }}
        />
        <Divider />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Content
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <div className="TokenContent">{tokenContent?.content?.payload}</div>
          </Typography>

          <Typography gutterBottom variant="h5" component="div">
            Raw
          </Typography>
          <Box sx={{ boxShadow: 3 }}>
            <ReactJson
              src={tokenContent ?? {}}
              displayObjectSize={false}
              displayDataTypes={false}
              collapseStringsAfterLength={120}
              theme="chalk"
            />
          </Box>
        </CardContent>
      </Card>
      <Dialog
        open={isBurnDialogOpen}
        onClose={() => setIsBurnDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Burn token?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you wish to permanently delete this token? This action can&apos;t be undone.
          </DialogContentText>
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
            onClick={() => setIsBurnDialogOpen(false)}
          >
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
    </div>
  )
}

export default TokenShow

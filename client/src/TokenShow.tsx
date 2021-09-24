import { RippleAPI, TransactionJSON } from '@ledhed2222/ripple-lib'
import axios from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react'
import ReactJson from 'react-json-view'
import { useHistory, useParams } from 'react-router-dom'

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
  const { id } = useParams<Params>()
  const historyRouter = useHistory()

  useEffect(() => {
    const loadToken = async () => {
      const response = await axios({
        method: 'get',
        url: `/api/contents/${id}`,
      })
      setTokenContent(response.data)
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
    if (
      !window.confirm(
        "Are you sure you wish to permanently delete this token? This action can't be undone.",
      ) ||
      tokenContent == null
    ) {
      return
    }

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

    historyRouter.push(
      '/tokens', 
      { burnedTokenTitle: tokenContent?.token.title, isBurnSuccess: true },
    )
  }

  return (
    <div className="TokenShow">
      <Card sx={{ boxShadow: 2 }}>
        <CardHeader
          avatar={
            tokenContent && <Identicon value={tokenContent.token.payload.tx_json.hash} />
          }
          action={
            <IconButton aria-label="settings">
              <Button sx={{ background: 'white' }} variant="outlined" color="error" onClick={burnToken}>
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
    </div>
  )
}

export default TokenShow

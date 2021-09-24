import { RippleAPI, NFTokenStorageOption } from '@ledhed2222/ripple-lib'
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import React, { useState } from 'react'
import { PulseLoader } from 'react-spinners'

import './CreateForm.css'

interface Props {
  client: RippleAPI
  isConnected: boolean
}

// TODO this is ridiculous yes, but these are values from a standalone node so
// aren't sensitive
export const ISSUER_SEED = 'sEdV7xTKH4B2XFyW9h4F3VSBYradsnQ'
const ISSUER_ADDRESS = 'rnvkNkdTzUmgkGcEUTXHChbC3YxhEonTsF'

const CreateForm = ({ client, isConnected }: Props) => {
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isMintSuccess, setIsMintSuccess] = useState<boolean>(false)

  const onTitleChange = (evn: React.ChangeEvent<HTMLInputElement>) => {
    evn.preventDefault()
    setTitle(evn.target.value)
  }

  const onContentChange = (evn: React.ChangeEvent<HTMLTextAreaElement>) => {
    evn.preventDefault()
    setContent(evn.target.value)
  }

  const onSubmit = async (evn: React.SyntheticEvent) => {
    evn.preventDefault()

    // validations
    if (!client.isConnected()) {
      return
    }
    if (title.length === 0) {
      return
    }
    if (content.length === 0) {
      return
    }

    setIsLoading(true)

    // post data onto backend
    const contentId = (
      await axios({
        method: 'post',
        url: '/api/contents',
        data: {
          title,
          payload: content,
        },
      })
    ).data as number
    // mint
    const [tokenID, mintResponse] = (await client.createNFToken(ISSUER_SEED, {
      issuingAccount: ISSUER_ADDRESS,
      storageOption: NFTokenStorageOption.CentralizedOffLedger,
      uri: `${window.location.origin}/tokens/${contentId}`,
      // TODO switch on environment
      skipValidation: false,
    })) as [string, string]

    // store this
    await axios({
      method: 'post',
      url: '/api/tokens',
      data: {
        token_id: tokenID,
        payload: mintResponse,
        content_id: contentId,
      },
    })

    setIsLoading(false)
    setIsMintSuccess(true)
  }

  const isMintButtonDisabled = () => {
    return (
      isLoading ||
      title.length === 0 ||
      content.length === 0 ||
      !client.isConnected()
    )
  }

  return (
    <div className="CreateForm">
      <form onSubmit={onSubmit}>
        {
          isMintSuccess &&
          <Alert onClose={() => setIsMintSuccess(false)}>
            Token Minted: {title}
          </Alert>
        }

        <TextField
          id="outlined-basic"
          required
          label="NFT Title"
          variant="outlined"
          value={title}
          onChange={onTitleChange}
          disabled={isLoading}
        />
        <TextField
          id="outlined-basic"
          required
          multiline
          fullWidth
          label="NFT Content"
          variant="outlined"
          minRows={4}
          value={content}
          onChange={onContentChange}
          disabled={isLoading}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={isMintButtonDisabled()}
        >
          Mint Token
        </Button>
      </form>
      <PulseLoader
        color="black"
        loading={isLoading}
        size={20}
        speedMultiplier={0.75}
      />
    </div>
  )
}

export default CreateForm

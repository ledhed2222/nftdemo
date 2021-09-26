import { RippleAPI, NFTokenStorageOption } from '@ledhed2222/ripple-lib'
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { useCookies } from 'react-cookie'

import axiosClient from './axiosClient'
import submit from './xumm'

import './CreateForm.css'

interface Props {
  client: RippleAPI | null
}

const uriToHex = (uri: string): string => (
  uri.split('').map((char) => (
    char.charCodeAt(0).toString(16).padStart(2, '0')
  )).join('').toUpperCase()
)

const CreateForm = ({ client }: Props) => {
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isMintSuccess, setIsMintSuccess] = useState<boolean>(false)
  const [cookies] = useCookies(['account'])
  const account = cookies.account

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
    if (!client?.isConnected()) {
      return
    }
    if (title.length === 0) {
      return
    }
    if (content.length === 0) {
      return
    }

    setIsLoading(true)

    // request user sign this TX 
    // TODO need to show QR code if not pushed
    const { data: { id: contentId } } = await axiosClient.request({
      method: 'post',
      url: '/api/contents',
      data: {
        title,
        payload: content,
      },
    })

    const mintTx = {
      TransactionType: 'NFTokenMint',
      TokenTaxon: 0,
      Flags: 8, // transferable
      TransferFee: 1,
      URI: uriToHex(`${window.location.origin}/tokens/${contentId as number}`),
    }
    const txResult = await submit(mintTx) as any
    debugger
    const nftNode = txResult?.meta?.AffectedNodes.find((node: any) => ( node?.ModifiedNode?.LedgerEntryType === 'NFTokenPage'
    ))
    const tokenID = nftNode?.ModifiedNode?.FinalFields?.NonFungibleTokens
      ?.map((nftoken: Record<string, unknown>) => {
        return (nftoken as any)?.NonFungibleToken?.TokenID
      })?.sort((first: string, second: string) => {
        const firstC = parseInt(first.substring(56), 16)
        const secondC = parseInt(second.substring(56), 16)
        if (firstC > secondC) {
          return 1
        }
        return -1
      })[0]



    await axiosClient.request({
      method: 'post',
      url: '/api/tokens',
      data: {
        payload: txResult,
        content_id: contentId,
        token_id: tokenID,
        owner: account,
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
      !client?.isConnected()
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

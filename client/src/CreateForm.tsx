import { RippleAPI, NFTokenStorageOption } from '@ledhed2222/ripple-lib'
import { useHistory } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { useCookies } from 'react-cookie'

import type { Content } from './types'
import axiosClient from './axiosClient'
import submit from './xumm'

import './CreateForm.css'

interface Props {
  client: RippleAPI | null
}

const uriToHex = (uri: string): string =>
  uri
    .split('')
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()

const CreateForm = ({ client }: Props) => {
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [{ account }] = useCookies(['account'])
  const historyRouter = useHistory()

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
    const { data } = await axiosClient.request({
      method: 'post',
      url: '/api/contents',
      data: {
        title,
        payload: content,
      },
    })
    const contentId = (data as Content).id

    const mintTx = {
      TransactionType: 'NFTokenMint',
      TokenTaxon: 0,
      Flags: 8, // transferable
      // TODO there is a xumm bug that doesn't allow a 0 transferfee
      TransferFee: 1,
      URI: uriToHex(`${window.location.origin}/tokens/${contentId}`),
    }
    const txResult = (await submit(mintTx)) as any
    const rawNftNode = txResult?.meta?.AffectedNodes.find(
      (node: any) =>
        node?.CreatedNode?.LedgerEntryType === 'NFTokenPage' ||
        node?.ModifiedNode?.LedgerEntryType === 'NFTokenPage',
    )
    const nftNode = rawNftNode.CreatedNode ?? rawNftNode.ModifiedNode
    const previousTokenIds = nftNode?.PreviousFields?.NonFungibleTokens?.map(
      (token: any) => token?.NonFungibleToken?.TokenID,
    )
    const previousTokenIdSet = new Set(previousTokenIds)
    const finalTokenIds = (
      nftNode.FinalFields ?? nftNode.NewFields
    )?.NonFungibleTokens?.map((token: any) => token?.NonFungibleToken?.TokenID)
    const tokenId = finalTokenIds.find(
      (tid: string) => !previousTokenIdSet.has(tid),
    )

    const uri = txResult?.transaction?.URI

    await axiosClient.request({
      method: 'post',
      url: '/api/tokens',
      data: {
        uri,
        payload: txResult,
        content_id: contentId,
        xrpl_token_id: tokenId,
        owner: account,
      },
    })

    setIsLoading(false)
    historyRouter.push('/my-tokens', {
      alertMessage: `Token Minted: ${title}`,
    })
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

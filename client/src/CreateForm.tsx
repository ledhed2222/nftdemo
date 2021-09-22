import { RippleAPI, NFTokenStorageOption } from '@ledhed2222/ripple-lib'
import axios from 'axios'
import React, { useState } from 'react'

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
    if (!isConnected) {
      return
    }
    if (title.length === 0) {
      return
    }
    if (content.length === 0) {
      return
    }
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
    axios({
      method: 'post',
      url: '/api/tokens',
      data: {
        token_id: tokenID,
        payload: mintResponse,
        content_id: contentId,
      },
    })
  }

  const isMintButtonDisabled = () => {
    return title.length === 0 || content.length === 0 || !client.isConnected()
  }

  return (
    <div className="CreateForm">
      <form onSubmit={onSubmit}>
        <input
          className="Title"
          required
          type="text"
          placeholder="NFT Title"
          onChange={onTitleChange}
        />
        <textarea
          className="Content"
          required
          placeholder="NFT content"
          value={content}
          onChange={onContentChange}
        />
        <input
          className="Submit"
          type="submit"
          value="Mint"
          disabled={isMintButtonDisabled()}
        />
      </form>
    </div>
  )
}

export default CreateForm

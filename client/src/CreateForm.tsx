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
const ISSUER_SEED = 'sEdV7xTKH4B2XFyW9h4F3VSBYradsnQ'
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
    const mintResponse = await client.createNFToken(ISSUER_SEED, {
      issuingAccount: ISSUER_ADDRESS,
      storageOption: NFTokenStorageOption.CentralizedOffLedger,
      uri: `${window.location.origin}/tokens/${contentId}`,
      // TODO switch on environment
      skipValidation: false,
    })
    // store this
    axios({
      method: 'post',
      url: '/api/tokens',
      data: {
        payload: mintResponse,
        content_id: contentId,
      },
    })
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
          disabled={false && !isConnected}
        />
      </form>
    </div>
  )
}

export default CreateForm

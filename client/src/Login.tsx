import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { GridLoader } from 'react-spinners'

import { requestSignature, signatureResult } from './xumm'
import axiosClient from './axiosClient'

const Login = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [{ account }, setCookie] = useCookies(['account'])
  const isLoggedIn = account != null

  const doLogin = async () => {
    const signatureRequestResponse = await requestSignature({
      TransactionType: 'SignIn',
    })
    setQrCodeUrl((signatureRequestResponse as any).refs.qr_png)
    const signedPayload = await signatureResult(
      signatureRequestResponse.refs.websocket_status,
    )
    const payloadId = signedPayload.payload_uuidv4

    const response = await axiosClient.request({
      method: 'post',
      url: '/api/sessions',
      data: {
        payload_id: payloadId,
      },
    })
    const newAccount = response.data

    setCookie('account', newAccount, {
      sameSite: 'strict',
      secure: true,
      maxAge: 604800, // 1 week
      path: '/',
    })
  }

  useEffect(() => {
    doLogin()
  }, [])

  if (isLoggedIn) {
    return <Redirect to="/" />
  }

  return (
    <div className="Login">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GridLoader color="white" loading={qrCodeUrl == null} />
      </div>
      {qrCodeUrl && (
        <div>
          <p>Scan this with your XUMM app to log in to your account:</p>
          <img src={qrCodeUrl} alt="Scan me with XUMM" />
        </div>
      )}
    </div>
  )
}

export default Login

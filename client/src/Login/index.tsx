import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import { GridLoader } from 'react-spinners'

import axiosClient from '../lib/axiosClient'
import { requestSignature, signatureResult } from '../lib/xumm'

import serverQr from './serverQr.png'
import './index.css'

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
      // 1 week
      maxAge: 604800,
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
        <>
          <div>
            <p>Scan this with your XUMM app to log in to your account:</p>
            <img className="qr" src={qrCodeUrl} alt="Scan me with XUMM" />
          </div>
          <div>
            <p>
              Make sure that you are connected to the correct server on XUMM.
              You can scan this QR code to add the correct server.
            </p>
            <img className="qr" src={serverQr} alt="Server QR code for XUMM" />
          </div>
        </>
      )}
    </div>
  )
}

export default Login

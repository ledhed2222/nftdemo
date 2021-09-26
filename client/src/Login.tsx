import React, { useRef, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { GridLoader } from 'react-spinners'
import { RippleAPI } from '@ledhed2222/ripple-lib'

import axiosClient from './axiosClient'

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
}

interface Props {
  client: RippleAPI | null
}

interface LoadedStateProps {
  qrCodeUrl: string | null
}

const Login = ({ client }: Props) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const ws = useRef<WebSocket | null>(null)
  const [_cookies, setCookie] = useCookies(['account'])

  useEffect(() => {
    const tearDownWs = () => {
      if (ws.current) {
        ws.current.close()
        ws.current = null
      }
    }

    const doPostSignIn = async (payloadId: string) => {
      if (!client?.isConnected()) {
        throw new Error('client not yet connected - this should not happen')
      }
      const response = await axiosClient.request({
        method: 'post',
        url: '/api/sessions',
        data: {
          payload_id: payloadId,
        },
      })
      const account = response.data

      setCookie(
        'account',
        account,
        {
          sameSite: 'strict',
          secure: true,
          maxAge: 604800, // 1 week
          path: '/',
        },
      )
    }

    const getQrCodeUrl = async () => {
      if (!client?.isConnected()) {
        return
      }
      const response = await axiosClient.request({
        method: 'get',
        url: '/api/sessions/start',
      })
      setQrCodeUrl(response.data.refs.qr_png)
      tearDownWs()
      ws.current = new WebSocket(response.data.refs.websocket_status)
      ws.current.onmessage = (wsMsg) => {
        const payload = JSON.parse(wsMsg.data)
        if (payload.signed) {
          doPostSignIn(payload.payload_uuidv4)
          tearDownWs()
        }
      }
    }

    getQrCodeUrl()
    return tearDownWs
  }, [client])

  return (
    <div className="Login">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GridLoader color="white" loading={client == null || qrCodeUrl == null} />
      </div>
      { client && qrCodeUrl &&
        <div>
          Scan this with your XUMM app to log in to your account:
          <img src={qrCodeUrl} alt="Scan me with XUMM" />
        </div>
      }
    </div>
  )
}

export default Login

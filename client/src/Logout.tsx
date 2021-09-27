import React, { useContext } from 'react'
import { useCookies } from 'react-cookie'
import { RippleAPI } from '@ledhed2222/ripple-lib'

import { clearState } from './state'
import MyTokens from './MyTokens'
import axiosClient from './axiosClient'

interface Props {
  client: RippleAPI | null
}

const Logout = ({ client }: Props) => {
  const { clearTokens } = useContext(MyTokens)
  const [cookies, _setCookie, removeCookie] = useCookies(['account'])
  const account = cookies.account

  const doLogout = async () => {
    await axiosClient.request({
      method: 'delete',
      url: '/api/sessions',
    })
    if (client?.isConnected()) {
      await client.request('unsubscribe', {
        accounts: [account],
      })
    }
    removeCookie('account')
    clearTokens()
    clearState()
  }

  return (
    <button type="button" onClick={doLogout}>
      Logout
    </button>
  )
}

export default Logout

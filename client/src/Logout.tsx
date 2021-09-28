import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { useCookies } from 'react-cookie'

import { clearState } from './state'
import axiosClient from './axiosClient'

const Logout = () => {
  const [{ account }, _setCookie, removeCookie] = useCookies(['account'])
  const isLoggedIn = account != null

  const doLogout = async () => {
    await axiosClient.request({
      method: 'delete',
      url: '/api/sessions',
    })
    removeCookie('account')
    clearState()
  }

  if (!isLoggedIn) {
    return <Redirect to="/" />
  }
  return (
    <button type="button" onClick={doLogout}>
      Logout
    </button>
  )
}

export default Logout

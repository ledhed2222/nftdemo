import Button from '@mui/material/Button'
import React, { useContext } from 'react'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'

import axiosClient from '../lib/axiosClient'
import { clearState } from '../STATE'

import './index.css'

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
    <div className="Logout">
      <Button
        className="LogoutButton"
        variant="contained"
        type="button"
        onClick={doLogout}
      >
        Logout
      </Button>
    </div>
  )
}

export default Logout

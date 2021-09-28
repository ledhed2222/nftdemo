import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import Button from '@mui/material/Button'

import { clearState } from './state'
import axiosClient from './axiosClient'

import './Logout.css'

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

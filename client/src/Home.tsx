import React from 'react'
import { Redirect } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const Home = () => {
  const [{ account }] = useCookies(['account'])
  const isLoggedIn = account != null

  return isLoggedIn ? <Redirect to="/create-token" /> : <Redirect to="/login" />
}

export default Home

import React from 'react'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'

const Home = () => {
  const [{ account }] = useCookies(['account'])
  const isLoggedIn = account != null

  return isLoggedIn ? <Redirect to="/create-token" /> : <Redirect to="/login" />
}

export default Home

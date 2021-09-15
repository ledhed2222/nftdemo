import { RippleAPI } from '@ledhed2222/ripple-lib'
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, NavLink } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import CreateForm from './CreateForm'
import TokenList from './TokenList'
import TokenShow from './TokenShow'

import './App.css'

const ROUTES = [
  {
    path: '/create-token',
    navName: 'Create Token',
    Component: CreateForm,
  },
  {
    path: '/tokens/:id',
    navName: null,
    Component: TokenShow,
  },
  {
    path: '/tokens',
    navName: 'All Tokens',
    Component: TokenList,
  },
]

// this is nik's development server
// const SERVER_URL = 'ws://71.38.165.199:6006'
// const SERVER_URL = 'wss://71.38.165.199:7007'
const SERVER_URL = 'wss://uhm.solike.wtf:7007'

const App = () => {
  const [client] = useState<RippleAPI>(new RippleAPI({ server: SERVER_URL }))
  const [isConnected, setIsConnected] = useState<boolean>(false)

  useEffect(() => {
    const doConnect = async () => {
      try {
        await client.connect()
      } catch (_err) {
        return
      }
      setIsConnected(true)
    }

    const doDisconnect = async () => {
      if (!isConnected) {
        return
      }
      await client.disconnect()
      setIsConnected(false)
    }

    doConnect()
    return () => {
      doDisconnect()
    }
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <nav className="NavBar">
          <ul>
            {ROUTES.filter(({ navName }) => navName != null).map(
              ({ path, navName }) => (
                <li key={path}>
                  <NavLink exact to={path} activeClassName="currentPage">
                    {navName}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="Disclaimer">
          Welcome to Ripple NFT minter demo! Super beta! No warranties! Keep
          your fingers crossed and your seat belt buckled!
        </div>
        <div className="ContentPortal">
          {ROUTES.map(({ path, Component }) => (
            <Route exact path={path} key={path}>
              {({ match }) => (
                <CSSTransition
                  in={match != null}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div className="Content">
                    <Component client={client} isConnected={isConnected} />
                  </div>
                </CSSTransition>
              )}
            </Route>
          ))}
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App

import { RippleAPI } from '@ledhed2222/ripple-lib'
import React, { useEffect, useState, useContext } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { useCookies } from 'react-cookie'

import STATE from '../state'

import NavBar from './NavBar'
import ROUTES from './routes'

import './index.css'

// this is nik's development server
const SERVER_URL = 'wss://uhm.solike.wtf:7007'
const THE_CLIENT = new RippleAPI({ server: SERVER_URL })

const App = () => {
  const [client, setClient] = useState<RippleAPI | null>(null)
  const [{ account }] = useCookies(['account'])
  const isLoggedIn = account != null

  const doConnect = async () => {
    await THE_CLIENT.connect()

    // TODO move this
    THE_CLIENT.connection.on('transaction', (msg) => {
      // handle specific transactions we are watching for completion
      const txHash = msg.transaction.hash
      STATE.completedTxHashes[txHash] = msg
      STATE.watchedTxHashes[txHash]?.resolve(txHash)
    })

    setClient(THE_CLIENT)
  }

  const doDisconnect = () => {
    setClient(null)
    THE_CLIENT.disconnect()
  }

  const doAccountChange = async () => {
    if (account == null) {
      return
    }
    if (!THE_CLIENT.isConnected()) {
      await doConnect()
    }
    THE_CLIENT.request('subscribe', {
      accounts: [account],
    })
  }

  const doAccountBeforeChange = () => {
    if (account == null || !THE_CLIENT.isConnected()) {
      return
    }
    THE_CLIENT.request('unsubscribe', {
      accounts: [account],
    })
  }

  useEffect(() => {
    doConnect()
    return doDisconnect
  }, [])

  useEffect(() => {
    doAccountChange()
    return doAccountBeforeChange
  }, [account])

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar loggedIn={isLoggedIn} />
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
                    <Component client={client} />
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

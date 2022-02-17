import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { CSSTransition as CST } from 'react-transition-group'
import { Client } from 'xrpl'

import NotFound from '../NotFound'
import STATE from '../STATE'

import NavBar from './NavBar'
import ROUTES from './ROUTES'

import './index.css'

// this is the NFT sandbox
const SERVER_URL = 'wss://xls20-sandbox.rippletest.net:51233'
const THE_CLIENT = new Client(SERVER_URL)

const App = () => {
  const [client, setClient] = useState<Client | null>(null)
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
    THE_CLIENT.request({
      command: 'subscribe',
      accounts: [account],
    })
  }

  const doAccountBeforeChange = () => {
    if (account == null || !THE_CLIENT.isConnected()) {
      return
    }
    THE_CLIENT.request({
      command: 'unsubscribe',
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
          <Switch>
            {ROUTES.map(({ path, Component }) => (
              <Route exact path={path} key={path}>
                {({ match }) => (
                  <CST
                    in={match != null}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                  >
                    <div className="Content">
                      <Component client={client} />
                    </div>
                  </CST>
                )}
              </Route>
            ))}
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App

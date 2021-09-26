import { RippleAPI } from '@ledhed2222/ripple-lib'
import React, { useEffect, useState, useContext } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { useCookies } from 'react-cookie'

import MyTokens from '../MyTokens'
import STATE from '../state'

import NavBar from './NavBar'
import ROUTES from './routes'

import './index.css'

// this is nik's development server
const SERVER_URL = 'wss://uhm.solike.wtf:7007'
const THE_CLIENT = new RippleAPI({ server: SERVER_URL })

const App = () => {
  const [client, setClient] = useState<RippleAPI | null>(null)
  const { myTokens, addToken } = useContext(MyTokens)
  const [cookies] = useCookies(['account'])
  const account = cookies.account
  const isLoggedIn = account != null

  const doConnect = async () => {
    await THE_CLIENT.connect()

    // TODO move this
    THE_CLIENT.connection.on('transaction', (msg) => {
      // handle specific transactions we are watching for completion
      const txHash = msg.transaction.hash
      STATE.completedTxHashes[txHash] = msg
      STATE.watchedTxHashes[txHash]?.resolve(txHash)
      // handle NFT movement for the current account
      // TODO fix this later using state mgmt with easy-peasy
      const txType = msg.transaction.TransactionType
      if (txType === 'NFTokenMint') {
        // const nftNode = msg?.meta?.AffectedNodes.find((node: any) => (
        //   node?.ModifiedNode?.LedgerEntryType === 'NFTokenPage'
        // ))
        // const tokenID = nftNode?.ModifiedNode?.FinalFields?.NonFungibleTokens
        //   ?.map((nftoken: Record<string, unknown>) => nftoken?.NonFungibleToken?.TokenID)
        //   ?.sort((first, second) => {
        //     const firstC = parseInt(first.substring(56), 16)
        //     const secondC = parseInt(second.substring(56), 16)
        //     if (firstC > secondC) {
        //       return 1
        //     }
        //     return -1
        //   })[0]
        // addToken(tokenID)
      }
    })

    setClient(THE_CLIENT)
  }

  const doDisconnect = () => {
    setClient(null)
    THE_CLIENT.disconnect()
  }

  useEffect(() => {
    doConnect()
    return doDisconnect
  }, [])

  useEffect(() => {
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

      const myTokensResponse = await THE_CLIENT.request('account_nfts', {
        account,
      })
      const newMyTokens = myTokensResponse.account_nfts.forEach((token: any) =>
        addToken(token?.TokenID),
      )
      //   .reduce((accum: Record<string, true>, token: any) => {
      //     /* eslint-disable no-param-reassign --
      //      * TODO */
      //     accum[token?.TokenID] = true
      //     /* eslint-enable no-param-reassign */
      //     return accum
      //   }, {})
      // setMyTokens(newMyTokens)
    }
    doAccountChange()
  }, [account])

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar loggedIn={isLoggedIn} />
        <div className="Disclaimer">
          Welcome to Ripple NFT minter demo! Super beta! No warranties! Keep
          your fingers crossed and your seat belt buckled!
        </div>
        <div className="ContentPortal">
          {ROUTES.filter(({ requiresState }) => {
            return (
              requiresState == null ||
              (isLoggedIn
                ? requiresState === 'LoggedIn'
                : requiresState === 'LoggedOut')
            )
          }).map(({ path, Component }) => (
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

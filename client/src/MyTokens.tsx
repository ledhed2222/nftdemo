import React, { FC, createContext, useState } from 'react'

interface Tokens {
  [key: string]: true
}

export interface MyTokensType {
  myTokens: Tokens
  addToken: (value: string) => void
  removeToken: (value: string) => void
  clearTokens: () => void
}

const MY_TOKENS: Tokens = {}

const addToken: (tokenID: string) => void = (tokenID) => {
  MY_TOKENS[tokenID] = true
}

const removeToken: (tokenID: string) => void = (tokenID) => {
  /* eslint-disable @typescript-eslint/no-dynamic-delete --
   * this is exactly what we want to do */
  delete MY_TOKENS[tokenID]
  /* eslint-enable @typescript-eslint/no-dynamic-delete */
}

const clearTokens = () => {
  for (const key of Object.keys(MY_TOKENS)) {
    /* eslint-disable @typescript-eslint/no-dynamic-delete --
     * this is exactly what we want to do */
    delete MY_TOKENS[key]
    /* eslint-enable @typescript-eslint/no-dynamic-delete */
  }
}

const MyTokensContext = createContext({
  myTokens: MY_TOKENS,
  addToken,
  removeToken,
  clearTokens,
} as MyTokensType)

const MyTokensProvider: FC = ({ children }) => {
  const value: MyTokensType = {
    myTokens: MY_TOKENS,
    addToken,
    removeToken,
    clearTokens,
  }

  return (
    <MyTokensContext.Provider value={value}>
      {children}
    </MyTokensContext.Provider>
  )
}

export { MyTokensContext as default, MyTokensProvider }

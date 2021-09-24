import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { GridLoader } from 'react-spinners'
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import './TokenList.css'

interface TokenPayload {
  tx_json: {
    Fee: string
    URI: string
    hash: string
    Flags: number
    Account: string
    Sequence: number
    TokenTaxon: number
    TxnSignature: string
    SigningPubKey: string
    TransactionType: 'NFTokenMint'
    LastLedgerSequence: number
  }
}

export interface Token {
  id: number
  payload: TokenPayload
  content_id: number
  created_at: string
  updated_at: string
  title: string
  decoded_uri: string
  token_id: string
}

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const TokenList = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isBurnSuccess, setIsBurnSuccess] = useState<boolean>(false)
  const [burnedTokenTitle, setBurnedTokenTitle] = useState<string>()
  const historyRouter = useHistory()
  const { state }: any = useLocation<Location>()

  useEffect(() => {
    const loadTokens = async () => {
      const response = await axios({
        method: 'get',
        url: '/api/tokens',
      })
      const newTokens = response.data as Token[]
      setTokens(newTokens)
      setIsLoading(false)

      if (state?.isBurnSuccess) {
        setIsBurnSuccess(state.isBurnSuccess)
        setBurnedTokenTitle(state.burnedTokenTitle)
        historyRouter.replace({})
      }
    }
    loadTokens()
  }, [])

  return (
    <div className="TokenList">
      {
        isBurnSuccess &&
        <Alert onClose={() => setIsBurnSuccess(false)} sx={{ maxWidth: '300px', margin: '0 auto', marginBottom: 5 }}>
          Token Burned: {burnedTokenTitle}
        </Alert>
      }
      <div style={loaderStyle}>
        <GridLoader color="black" loading={isLoading} />
      </div>
      {tokens.map((token) => (
        <TableContainer component={Paper} sx={{ maxWidth: '75%', margin: '0 auto', marginBottom: 5, boxShadow: 5 }}>
          <Table sx={{ minWidth: 200 }} aria-label="customized table">
            <TableBody>
              <StyledTableRow key={token.title}>
                <StyledTableCell component="th" scope="row">
                  <b>Title</b>
                </StyledTableCell>
                <StyledTableCell>{token.title}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow key={token.token_id}>
                <StyledTableCell component="th" scope="row">
                  <b>Token ID</b>
                </StyledTableCell>
                <StyledTableCell>{token.token_id}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow key={token.decoded_uri}>
                <StyledTableCell component="th" scope="row">
                  <b>URI</b>
                </StyledTableCell>
                <StyledTableCell>
                  <Link to={new URL(token.decoded_uri).pathname}>
                    {token.decoded_uri}
                  </Link>
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </div>
  )
}

export default TokenList

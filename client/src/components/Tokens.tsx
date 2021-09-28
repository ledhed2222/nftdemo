import React from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'

import type { Token } from '../types'

import './Tokens.css'

interface Props {
  tokens: Token[]
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const Tokens = ({ tokens }: Props) => {
  return (
    <div className="Tokens">
      {tokens.map((token) => (
        <TableContainer
          className={classnames('Token', { burned: token.burned })}
          component={Paper}
          sx={{
            maxWidth: '75%',
            margin: '0 auto',
            marginBottom: 5,
            boxShadow: 5,
          }}
        >
          <Table sx={{ minWidth: 200 }} aria-label="customized table">
            <TableBody>
              <StyledTableRow key={token.title}>
                <StyledTableCell component="th" scope="row">
                  <b>Title</b>
                </StyledTableCell>
                <StyledTableCell>{token.title}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow key={token.xrpl_token_id}>
                <StyledTableCell component="th" scope="row">
                  <b>Token ID</b>
                </StyledTableCell>
                <StyledTableCell>
                  {token.burned ? 'Burnt' : token.xrpl_token_id}
                </StyledTableCell>
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

export default Tokens

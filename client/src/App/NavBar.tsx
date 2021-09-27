import React from 'react'
import { NavLink } from 'react-router-dom'

import ROUTES from './routes'

interface Props {
  loggedIn: boolean
}

const NavBar = ({ loggedIn }: Props) => {
  return (
    <nav className="NavBar">
      <ul>
        {ROUTES.filter(({ navName }) => navName != null)
          .filter(({ requiresState }) => {
            return (
              requiresState == null ||
              (loggedIn
                ? requiresState === 'LoggedIn'
                : requiresState === 'LoggedOut')
            )
          })
          .map(({ path, navName }) => (
            <li key={path}>
              <NavLink exact to={path} activeClassName="currentPage">
                {navName}
              </NavLink>
            </li>
          ))}
      </ul>
    </nav>
  )
}

export default NavBar

import CreateForm from '../CreateForm'
import Home from '../Home'
import Login from '../Login'
import Logout from '../Logout'
import MyTokens from '../MyTokens'
import TokenList from '../TokenList'
import TokenShow from '../TokenShow'

const ROUTES = [
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/login',
    navName: 'Login',
    Component: Login,
    requiresState: 'LoggedOut',
  },
  {
    path: '/logout',
    navName: 'Logout',
    Component: Logout,
    requiresState: 'LoggedIn',
  },
  {
    path: '/create-token',
    navName: 'Create Token',
    Component: CreateForm,
    requiresState: 'LoggedIn',
  },
  {
    path: '/tokens/:id',
    Component: TokenShow,
  },
  {
    path: '/tokens',
    navName: 'All Tokens',
    Component: TokenList,
  },
  {
    path: '/my-tokens',
    navName: 'My Tokens',
    Component: MyTokens,
    requiresState: 'LoggedIn',
  },
]
export default ROUTES

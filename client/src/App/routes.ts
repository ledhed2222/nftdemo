import Home from '../Home'
import CreateForm from '../CreateForm'
import Login from '../Login'
import Logout from '../Logout'
import TokenList from '../TokenList'
import TokenShow from '../TokenShow'
import MyTokensList from '../MyTokensList'

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
    Component: MyTokensList,
    requiresState: 'LoggedIn',
  },
]
export default ROUTES

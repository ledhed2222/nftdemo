import CreateForm from '../CreateForm'
import Login from '../Login'
import Logout from '../Logout'
import TokenList from '../TokenList'
import TokenShow from '../TokenShow'
import MyTokensList from '../MyTokensList'

const ROUTES = [
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
    navName: null,
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

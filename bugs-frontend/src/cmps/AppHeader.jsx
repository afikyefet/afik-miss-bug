
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { login, logout, signUp } from '../store/userActions.js'
import { LoginSignup } from './LoginSignup'
import { UserMsg } from './UserMsg'

export function AppHeader() {

  const loggedInUser = useSelector(state => state.userModule.loggedInUser)

  async function onLogin(credentials) {
    console.log(credentials)
    try {
      await login(credentials)
      showSuccessMsg(`Welcome!`)
    } catch (err) {
      console.log('Cannot login :', err)
      showErrorMsg(`Cannot login`)
    }
  }

  async function onSignup(credentials) {
    console.log(credentials)
    try {
      await signUp(credentials)
      showSuccessMsg(`Welcome!`)
    } catch (err) {
      console.log('Cannot signup :', err)
      showErrorMsg(`Cannot signup`)
    }
  }

  async function onLogout() {
    try {
      await logout()
      showSuccessMsg('Logged out')
    } catch (err) {
      console.log('can not logout');
    }
  }

  return (
    <header className='app-header '>
      <div className='header-container'>
        <UserMsg />
        <section className="login-signup-container">
          {!loggedInUser && <LoginSignup onLogin={onLogin} onSignup={onSignup} />}

          {loggedInUser && <div className="user-preview">
            <h3>Hello {loggedInUser.fullname}</h3>
            <button onClick={onLogout}>Logout</button>
          </div>}
        </section>
        <nav className='app-nav'>
          <NavLink to="/">Home</NavLink> |
          <NavLink to="/bug">Bugs</NavLink> |
          <NavLink to="/user">Users</NavLink> |
          <NavLink to="/about">About</NavLink>
        </nav>
      </div>
    </header>
  )
}


import { useEffect, useState } from 'react'
import { UserMsg } from './UserMsg'
import { NavLink } from 'react-router-dom'
import { userService } from '../services/user.service'
import { LoginSignup } from './LoginSignup'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function AppHeader() {

  const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())

  async function onLogin(credentials) {
    console.log(credentials)
    try {
      const user = await userService.login(credentials)
      setLoggedinUser(user)
    } catch (err) {
      console.log('Cannot login :', err)
      showErrorMsg(`Cannot login`)
    }
  }

  async function onSignup(credentials) {
    console.log(credentials)
    try {
      const user = await userService.signup(credentials)
      setLoggedinUser(user)
      showSuccessMsg(`Welcome ${user.fullname}`)
    } catch (err) {
      console.log('Cannot signup :', err)
      showErrorMsg(`Cannot signup`)
    }
  }

  async function onLogout() {
    try {
      await userService.logout()
      setLoggedinUser(null)
    } catch (err) {
      console.log('can not logout');
    }
  }

  return (
    <header className='app-header '>
      <div className='header-container'>
        <UserMsg />
        <section className="login-signup-container">
          {!loggedinUser && <LoginSignup onLogin={onLogin} onSignup={onSignup} />}

          {loggedinUser && <div className="user-preview">
            <h3>Hello {loggedinUser.fullname}</h3>
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

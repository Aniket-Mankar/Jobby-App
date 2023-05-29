import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onLoginSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onLoginFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    if (response.ok === true) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {showSubmitError, errorMsg} = this.state
    return (
      <>
        <div className="login-container">
          <div className="form-container">
            <div className="logo-cont">
              <img
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
                className="form-logo"
              />
            </div>
            <form onSubmit={this.submitForm}>
              <label htmlFor="user" className="label-ele">
                USERNAME
              </label>
              <br />
              <input
                type="text"
                id="user"
                className="input-ele"
                onChange={this.onChangeUsername}
              />
              <br />
              <label htmlFor="password" className="label-ele">
                PASSWORD
              </label>
              <br />
              <input
                type="password"
                id="password"
                className="input-ele"
                onChange={this.onChangePassword}
              />
              <div className="button-container">
                <button type="submit" className="login-button">
                  Login
                </button>
              </div>
              {showSubmitError && <p className="errorMessage">* {errorMsg}</p>}
            </form>
          </div>
        </div>
      </>
    )
  }
}

export default Login

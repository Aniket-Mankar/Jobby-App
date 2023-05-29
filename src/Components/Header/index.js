import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const deleteCookies = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <div className="nav-container">
      <nav>
        <ul type="none" className="nav-items">
          <li>
            <Link to="/" className="link">
              <img
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
                className="logo-img"
              />
            </Link>
          </li>
          <div className="home-and-jobs-container">
            <li>
              <Link to="/" className="link">
                <p className="links-name">Home</p>
              </Link>
            </li>
            <li>
              <Link to="/jobs" className="link">
                <p className="links-name">Jobs</p>
              </Link>
            </li>
          </div>
          <li>
            <button
              type="button"
              className="button-ele"
              onClick={deleteCookies}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default withRouter(Header)

import {Redirect, Link} from 'react-router-dom'
import './index.css'
import Cookies from 'js-cookie'
import Header from '../Header'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <div>
      <Header />
      <div className="home-container">
        <div className="items">
          <h1 className="home-head">Find The Job That Fits Your Life</h1>
          <p className="home-description">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fors your abilitys and
            peotential.
          </p>
          <Link to="/jobs" className="link">
            <button className="home-button-ele" type="button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home

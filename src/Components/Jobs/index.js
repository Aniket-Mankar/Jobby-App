import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsSearch, BsBriefcase} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class Jobs extends Component {
  state = {
    profileDetails: {},
    allJobList: [],
    salaryRanges: '',
    searchResult: '',
    getSelectValue: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {salaryRanges, searchResult, getSelectValue} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const allJobsUrl = `https://apis.ccbp.in/jobs?employment_type=${getSelectValue}&minimum_package=${salaryRanges}&search=${searchResult}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const newProfileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: newProfileData,
        apiStatus: apiStatusConstants.success,
      })
    }
    const listAllJobs = await fetch(allJobsUrl, options)
    if (listAllJobs.ok === true) {
      const jobData = await listAllJobs.json()
      const allJobData = jobData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        allJobList: allJobData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  getValue = event => {
    this.setState({getSelectValue: event.target.value})
  }

  getRadioId = event => {
    this.setState({salaryRanges: event.target.value}, this.getProfile)
  }

  getValueOfInput = event => {
    this.setState({searchResult: event.target.value})
  }

  renderListOfJobs = () => {
    const {allJobList} = this.state
    const shouldShowProductsList = allJobList.length > 0
    return shouldShowProductsList ? (
      <div>
        <ul type="none">
          {allJobList.map(eachItemOf => (
            <li key={eachItemOf.id} className="jobs-list-container-of">
              <Link to={`/JobDetails/${eachItemOf.id}`} className="link">
                <div className="logo-rating-title-con">
                  <img
                    src={eachItemOf.companyLogoUrl}
                    alt="company logo"
                    className="company-logo-of"
                  />
                  <div className="title-and-rating">
                    <h1 className="company-title">{eachItemOf.title}</h1>
                    <div className="rating-container">
                      <AiFillStar className="logo-icon" />
                      <p className="rating-num">{eachItemOf.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="location-job-LPA-container">
                  <div className="container-for-flex">
                    <div className="container-for-flex">
                      <GoLocation className="location-job-logo" />
                      <p className="location-job-para">{eachItemOf.location}</p>
                    </div>
                    <div className="container-for-flex">
                      <BsBriefcase className="location-job-logo" />
                      <p className="location-job-para">
                        {eachItemOf.employmentType}
                      </p>
                    </div>
                  </div>
                  <p className="package-para">{eachItemOf.packagePerAnnum}</p>
                </div>
                <hr />
                <h1 className="description-head">Description</h1>
                <p className="description-explain">
                  {eachItemOf.jobDescription}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-products-img"
          alt="no jobs"
        />
        <h1 className="no-products-heading">No Jobs Found</h1>
        <p className="no-products-description">
          We could not find any jobs. Try other filters
        </p>
      </div>
    )
  }

  makeUpiCall = () => this.getProfile()

  makeUpiCallOf = () => this.getProfile()

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="products failure"
        className="failure view"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-button" onClick={this.makeUpiCall}>
        Retry
      </button>
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderListOfJobs()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onEnterSearchInput = () => {
    this.getProfile()
  }

  render() {
    const {employmentTypesList, salaryRangesList} = this.props
    const {profileDetails, searchResult, allJobList} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    const shouldShowProductsList = allJobList.length > 0
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <>
        <Header />
        <div className="product-sections">
          <div className="controller-container">
            <div>
              {shouldShowProductsList ? (
                <div className="profile-section">
                  <img
                    src={profileImageUrl}
                    alt="profile"
                    className="profile-logo"
                  />
                  <h1 className="profile-name-ele">{name}</h1>
                  <p className="profile-bio">{shortBio}</p>
                </div>
              ) : (
                <button
                  type="button"
                  className="retry-button"
                  onClick={this.makeUpiCallOf}
                >
                  Retry
                </button>
              )}
              <hr className="hr-line" />
              <div className="type-of-Emp">
                <h1 className="emp-head">Type of Employment</h1>
                <ul type="none" className="unordered-list">
                  {employmentTypesList.map(eachItem => (
                    <li
                      key={eachItem.employmentTypeId}
                      className="job-type-container"
                    >
                      <input type="checkbox" id={eachItem.label} />
                      <label
                        className="label-element"
                        htmlFor={eachItem.label}
                        onClick={this.getValue}
                        value={eachItem.employmentTypeId}
                      >
                        {eachItem.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="hr-line" />
              <div>
                <h1 className="emp-head">Salary Range</h1>
                <ul type="none" className="unordered-list">
                  {salaryRangesList.map(eachItem => (
                    <li
                      key={eachItem.salaryRangeId}
                      className="job-type-container"
                    >
                      <input
                        type="radio"
                        id={eachItem.label}
                        name="gender"
                        onChange={this.getRadioId}
                        value={eachItem.salaryRangeId}
                      />
                      <label className="label-element" htmlFor={eachItem.label}>
                        {eachItem.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="search-input-post-container">
              <div className="search-input-container">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search"
                  value={searchResult}
                  onChange={this.getValueOfInput}
                />
                <button
                  type="button"
                  data-testid="searchButton"
                  className="search-icon-contai"
                  onClick={this.onEnterSearchInput}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
              <div>{this.renderAllProducts()}</div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs

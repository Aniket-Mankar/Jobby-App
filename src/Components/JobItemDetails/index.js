import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'
import {BsBriefcase} from 'react-icons/bs'
import {HiExternalLink} from 'react-icons/hi'
import {Redirect} from 'react-router-dom'
import Header from '../Header'
import './index.css'

class JobDetails extends Component {
  state = {
    jobDetails: {},
    skills: [],
    lifeAtCompany: {},
    locationAndLpaAndRating: {},
    similarJobs: [],
    isLoading: true,
  }

  componentDidMount() {
    this.getSimilarProduct()
  }

  getSimilarProduct = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const jobDetailsOf = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
      }
      const skillsOf = data.job_details.skills.map(eachSkills => ({
        imageUrl: eachSkills.image_url,
        name: eachSkills.name,
      }))
      const lifeAtCompanyOf = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }
      const locationAndLpaAndRatingOf = {
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
      }
      const similarJobsOf = data.similar_jobs.map(eachJobs => ({
        companyLogoUrl: eachJobs.company_logo_url,
        employmentType: eachJobs.employment_type,
        id: eachJobs.id,
        jobDescription: eachJobs.job_description,
        location: eachJobs.location,
        rating: eachJobs.rating,
        title: eachJobs.title,
      }))
      this.setState({
        jobDetails: jobDetailsOf,
        skills: skillsOf,
        lifeAtCompany: lifeAtCompanyOf,
        locationAndLpaAndRating: locationAndLpaAndRatingOf,
        similarJobs: similarJobsOf,
        isLoading: false,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllListView = () => {
    const {
      jobDetails,
      skills,
      lifeAtCompany,
      locationAndLpaAndRating,
      similarJobs,
    } = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
    } = jobDetails
    const {location, packagePerAnnum, rating} = locationAndLpaAndRating
    const {description, imageUrl} = lifeAtCompany

    return (
      <div className="main-container">
        <div className="JobDetails-container">
          <div className="jobs-card">
            <div className="logo-rating-title-con">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo-of"
              />
              <div className="title-and-rating">
                <p className="company-title">Title</p>
                <div className="rating-container">
                  <AiFillStar className="logo-icon" />
                  <p className="rating-num">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-job-LPA-container">
              <div className="container-for-flex">
                <div className="container-for-flex">
                  <GoLocation className="location-job-logo" />
                  <p className="location-job-para">{location}</p>
                </div>
                <div className="container-for-flex">
                  <BsBriefcase className="location-job-logo" />
                  <p className="location-job-para">{employmentType}</p>
                </div>
              </div>
              <p className="package-para">{packagePerAnnum}</p>
            </div>
            <hr />
            <div className="location-job-LPA-container space">
              <h1 className="description-head">Description</h1>
              <div className="container-for-flex">
                <a
                  href={companyWebsiteUrl}
                  className="visit-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit
                </a>
                <HiExternalLink className="link-logo" />
              </div>
            </div>
            <p className="description-explain">{jobDescription}</p>
            <p className="company-title">Skills</p>
            <div className="lost-container">
              <ul type="none" className="list-of">
                {skills.map(eachLitems => (
                  <li key={eachLitems.imageUrl} className="list">
                    <div className="skills-img-name">
                      <img
                        src={eachLitems.imageUrl}
                        alt={eachLitems.name}
                        className="company-logo-of"
                      />
                      <p className="skills-name">{eachLitems.name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <h1 className="lice-head">Life at Company</h1>
            <div className="life-company-container">
              <p className="life-description">{description}</p>
              <img src={imageUrl} alt="life at company" className="life-img" />
            </div>
          </div>
        </div>
        <div className="jobb-container">
          <h1 className="similar-head">Similar Jobs</h1>
          <ul className="similar-card">
            {similarJobs.map(eachItem => (
              <li key={eachItem.id} type="none" className="similer-list-cont">
                <div className="logo-rating-title-con">
                  <img
                    src={eachItem.companyLogoUrl}
                    alt="details company logo"
                    className="company-logo-of"
                  />
                  <div className="title-and-rating">
                    <p className="similar-company-title">{eachItem.title}</p>
                    <div className="rating-container">
                      <AiFillStar className="logo-icon" />
                      <p className="rating-num">{eachItem.rating}</p>
                    </div>
                  </div>
                </div>
                <h1 className="description-head">Description</h1>
                <p className="description-explainOf">
                  {eachItem.jobDescription}
                </p>
                <div className="container-for-flex">
                  <div className="container-for-flex">
                    <GoLocation className="location-job-logo" />
                    <p className="location-job-para">{eachItem.location}</p>
                  </div>
                  <div className="container-for-flex">
                    <BsBriefcase className="location-job-logo" />
                    <p className="location-job-para">
                      {eachItem.employmentType}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    const {isLoading} = this.state
    return (
      <div>
        <Header />
        {isLoading ? this.renderLoadingView() : this.renderAllListView()}
      </div>
    )
  }
}

export default JobDetails

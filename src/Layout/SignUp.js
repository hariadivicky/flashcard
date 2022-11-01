import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"
import { signUp } from "../utils/api/index"

function SignUp() {
  let history = useHistory();
  const initialFormState = {
    email: '',
    password: '',
    name: ''
  }
  const [formData, setFormData] = useState({...initialFormState});
  const [errorResponse, setErrorResponse] = useState({ errors: [] })
  const [showSuccess, setShowSuccess] = useState(false)
  const onFormStateChange = ({target}) => {
    setFormData({
        ...formData, [target.name]: target.value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const res = await signUp(formData)
      setShowSuccess(true)

      setTimeout(() => {
        history.push('/sign_in')
      }, 2000)
    } catch (e) {
      setErrorResponse(JSON.parse(e.message))
    }
  }

  return (
    <div>
      <h1 className='my-4 text-center'>Sign Up</h1>
      <div className="row">
        <div className="col-12 col-md-5 mx-auto">
          {errorResponse.errors.length > 0 && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <div>
                {errorResponse.errors.map(error => <p>{error}</p>)}
              </div>
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          )}
          {showSuccess && (
            <div className="alert alert-success show" role="alert">
              Success, you will be redirected to sign in page...
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Full Name"
                required
                name="name"
                onChange={onFormStateChange}
                value={formData.name}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                required
                name="email"
                onChange={onFormStateChange}
                value={formData.email}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                required
                name="password"
                onChange={onFormStateChange}
                value={formData.password}
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary">Sign up</button>
            </div>
          </form>
          <p className="mt-4">
            Already have an account? <Link to='/sign_in'>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
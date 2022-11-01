import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"
import { signIn } from "../utils/api/index"

function SignIn() {
  let history = useHistory();
  const initialFormState = {
    email: '',
    password: ''
  }
  const [formData, setFormData] = useState({...initialFormState});
  const [errorResponse, setErrorResponse] = useState({ error: '' })
  const onFormStateChange = ({target}) => {
    setFormData({
        ...formData, [target.name]: target.value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const res = await signIn(formData)
      localStorage.setItem('flashcard-app-session', JSON.stringify(res))
      history.push('/')
    } catch (e) {
      setErrorResponse(JSON.parse(e.message))
    }
  }

  return (
    <div>
      <h1 className='my-4 text-center'>Sign In</h1>
      <div className="row">
        <div className="col-12 col-md-5 mx-auto">
          {errorResponse.error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {errorResponse.error}
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                type="text"
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
              <button type="submit" className="btn btn-primary">Sign In</button>
            </div>
          </form>
          <p className="mt-4">
            Don't have an account? <Link to='/sign_up'>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
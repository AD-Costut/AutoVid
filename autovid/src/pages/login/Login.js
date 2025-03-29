import "./Login.css";
export default function Login() {
  return (
    <div className="container">
      <div className="box-login">
        <div className="logInStyles">
          <h1 className="login-title">Login</h1>
          <form>
            <div className="mb-3 input-holder-login">
              <label for="exampleInputEmail1" className="form-label">
                Email address:
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3 input-holder-login">
              <label for="exampleInputPassword1" className="form-label">
                Password:
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
              />
            </div>
            {/* <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
              />
              <label className="form-check-label" for="exampleCheck1">
                Check me out
              </label>
            </div> */}
            <a href="register" className="go-to-register">
              Don't have an account? Click here!
            </a>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <div className="empty-line"></div>
            <h1>Or</h1>
            <div className="empty-line"></div>
            <button className="form-label">Google login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

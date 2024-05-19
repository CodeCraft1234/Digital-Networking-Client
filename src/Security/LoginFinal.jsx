
// import './Login.css'
const LoginFinal = () => {
  return (
    <div className="mt-6">
      <div className="box">
        <div className="login">
          <div className="loginBx">
            <h2>
              <i className="fa-solid fa-right-to-bracket"></i> Login{" "}
              <i className="fa-solid fa-heart"></i>
            </h2>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <input type="submit" value="Sign in" />
            <div className="group">
              <a href="#">Forgot Password</a>
              <a href="#">Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFinal;

import React, { useState, useEffect } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegistrationForm from "../components/auth/RegistrationForm";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    document.body.classList.add("login");
    return () => document.body.classList.remove("login");
  }, []);

  return (
    <div className="auth-page">
      <h1>Welcome to Gaming Tournament</h1>

      {isLogin ? (
        <>
          <LoginForm />
          <p className="toggle-text">
            Don't have an account?{" "}
            <button
              onClick={() => setIsLogin(false)}
              className="toggle-button"
            >
              Register here
            </button>
          </p>
        </>
      ) : (
        <>
          <RegistrationForm />
          <p className="toggle-text">
            Already have an account?{" "}
            <button
              onClick={() => setIsLogin(true)}
              className="toggle-button"
            >
              Login here
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export default LoginPage;

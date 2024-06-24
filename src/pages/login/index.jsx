import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockFilled,
} from "@ant-design/icons";
import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SocialLogin } from "../../components/shared";
import { REGISTER } from "../../constants/routes";
import { useDocumentTitle } from "../../hooks";
import logo_dark from "../../images/LogoSocialMedia.png";
import { loginStart } from "../../redux/action/authActions";
import { setAuthErrorMessage } from "../../redux/action/errorActions";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();

  useDocumentTitle("Login to SocialMedia");

  useEffect(() => {
    return () => {
      dispatch(setAuthErrorMessage(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, isLoading } = useSelector((state) => ({
    error: state.error.authError,
    isLoading: state.loading.isLoadingAuth,
  }));

  const onUsernameChange = (e) => {
    const val = e.target.value.trim();
    setUsername(val);
  };

  const onPasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (username && password) {
      dispatch(loginStart(username, password));
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="w-full max-w-md p-8 rounded-md shadow-md">
        <Link to="/">
          <img
            src={logo_dark}
            alt="Social Media Logo"
            className="w-24 mx-auto mb-8"
          />
        </Link>

        {error && (
          <div className="py-2 w-full text-center bg-red-100 border-red-300 mb-4">
            <p className="text-red-500">
              {error?.error?.message || "Something went wrong :("}
            </p>
          </div>
        )}

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                required
                maxLength={30}
                className={`w-full px-4 py-2 border rounded-md ${error ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-indigo-500`}
                placeholder="Email Address"
                readOnly={isLoading}
                onChange={onUsernameChange}
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                autoComplete="current-password"
                required
                className={`w-full px-4 py-2 border rounded-md ${error ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-indigo-500`}
                placeholder="Password"
                minLength={8}
                maxLength={100}
                onChange={onPasswordChange}
                readOnly={isLoading}
                value={password}
              />
              <div className="absolute right-0 top-0 bottom-0 my-auto flex items-center justify-center w-12 h-12 hover:bg-gray-200 cursor-pointer rounded-tr-full rounded-br-full z-10">
                {isPasswordVisible ? (
                  <EyeInvisibleOutlined
                    className="h-full w-full outline-none text-gray-500"
                    onClick={() => setPasswordVisible(false)}
                  />
                ) : (
                  <EyeOutlined
                    className="h-full w-full outline-none"
                    onClick={() => setPasswordVisible(true)}
                  />
                )}
              </div>
            </div>
          </div>

          <Link
            className="font-medium text-sm text-gray-400 inline-block mb-4 hover:text-indigo-500 underline"
            to="/forgot-password"
          >
            Forgot your password?
          </Link>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:border-indigo-400"
            disabled={isLoading}
          >
            <LockFilled className="mr-2" />
            {isLoading ? "Logging In..." : "Login"}
          </button>
          <div className="mt-4">
            <i className="social-login-divider">OR</i>
            <div className="flex justify-between space-x-2">
              <SocialLogin isLoading={isLoading} />
            </div>
          </div>
        </form>
        <div className="text-center mt-8">
          <Link
            className="underline font-medium"
            onClick={(e) => isLoading && e.preventDefault()}
            to={REGISTER}
          >
            I don't have an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

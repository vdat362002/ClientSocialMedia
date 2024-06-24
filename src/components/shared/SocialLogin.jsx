import {
  //   FacebookFilled,
  //   GithubFilled,
  GoogleOutlined,
} from "@ant-design/icons";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
const SocialLogin = ({ isLoading }) => {
  const onClickSocialLogin = (e) => {
    if (isLoading) e.preventDefault();
  };

  const onSuccess = (response) => {
    // onLoginWithGoogle(response.tokenObj.id_token);
    const values = jwtDecode(response);
    const data = {
      email: values.email,
      password: values.sub,
      name: values.name,
      status: true,
      image: values.picture,
    };
    console.log(data);
  };

  const onError = () => {
    toast.error("Login with Google error!");
  };
  return (
    <div className="w-full flex space-x-2 items-center">
      {/* <a
                className="button w-full bg-blue-500 hover:bg-blue-600"
                href={`${process.env.REACT_APP_SocialMedia_URL}/api/v1/auth/facebook`}
                onClick={onClickSocialLogin}
            >
                <FacebookFilled className="m-0 laptop:mr-4 text-xl laptop:text-sm" />
                <span className="hidden laptop:inline-block">Facebook</span>
            </a> */}
      <a
        className="button w-full text-gray-800 bg-white hover:bg-gray-200 border border-gray-200"
        href={`${process.env.REACT_APP_SocialMedia_URL}/api/v1/auth/google`}
        onClick={onClickSocialLogin}
      >
        <GoogleOutlined className="m-0 laptop:mr-4 text-xl laptop:text-sm" />
        <span className="hidden laptop:inline-block">Google</span>
      </a>
      {/* <a
                className="button w-full border border-gray-300 bg-gray-700 hover:bg-gray-600"
                href={`${process.env.REACT_APP_SocialMedia_URL}/api/v1/auth/github`}
                onClick={onClickSocialLogin}
            >
                <GithubFilled className="m-0 laptop:mr-4 text-xl laptop:text-sm" />
                <span className="hidden laptop:inline-block">GitHub</span>
            </a> */}
      {/* https://accounts.google.com/gsi/select?client_id=341213027371-d8jtlok8s85eqhsdb3mde1lllqbd70dk.apps.googleusercontent.com&ux_mode=popup&ui_mode=card&as=qi5jzLdzxrZGGnaOdoR1iw&channel_id=6b7ed6fb3389b1d384659f7512364f5ab7c11918b8a0face7e10abf51f07b696&origin=http%3A%2F%2Flocalhost%3A3000 */}

      {/* <GoogleLogin
        clientId="243901647729-72v28fi3vpa0v0qi0c47n376efoc8gj2.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={onSuccess}
        onFailure={onError}
        prompt="select_account"
        cookiePolicy={"single_host_origin"}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="button w-full text-gray-800 bg-white hover:bg-gray-200 border border-gray-200 flex items-center justify-center"
          >
            <GoogleOutlined className="m-0 mr-4 text-xl" />
            <span>Google</span>
          </button>
        )}
      /> */}
    </div>
  );
};

export default SocialLogin;

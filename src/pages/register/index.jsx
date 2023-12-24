import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SocialLogin } from '../../components/shared';
import { LOGIN } from '../../constants/routes';
import { useDocumentTitle } from '../../hooks';
import logo_dark from '../../images/LogoSocialMedia.png';
import { registerStart } from '../../redux/action/authActions';
import { setAuthErrorMessage } from '../../redux/action/errorActions';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const dispatch = useDispatch();

    useDocumentTitle('Register to SocialMedia');

    useEffect(() => {
        return () => {
            dispatch(setAuthErrorMessage(null));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { error, isLoading } = useSelector((state) => ({
        error: state.error.authError,
        isLoading: state.loading.isLoadingAuth
    }));

    const onEmailChange = (e) => {
        const val = e.target.value.trim();
        setEmail(val.toLowerCase());
    };

    const onPasswordChange = (e) => {
        const val = e.target.value.trim();
        setPassword(val);
    };

    const onUsernameChange = (e) => {
        const val = e.target.value.trim();
        setUsername(val.toLowerCase());
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (email && password && username) {
            dispatch(registerStart({ email, password, username }));
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-white">
            <div className="w-full max-w-md p-8 rounded-md shadow-md">
                <Link to="/">
                    <img
                        src={logo_dark}
                        alt="SocialMedia Logo"
                        className="w-24 mx-auto mb-8"
                    />
                </Link>

                {error && (
                    <div className="py-2 w-full text-center bg-red-100 border-red-400 mb-4">
                        <p className="text-red-500 text-sm">{error?.error?.message || 'Something went wrong :('}</p>
                    </div>
                )}

                <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="rounded-md shadow-sm space-y-2">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                className={`w-full px-4 py-2 border rounded-md ${
                                    error ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:border-indigo-500`}
                                onChange={onUsernameChange}
                                autoComplete="username"
                                maxLength={30}
                                required
                                readOnly={isLoading}
                                placeholder="Username"
                                value={username}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                className={`w-full px-4 py-2 border rounded-md ${
                                    error ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:border-indigo-500`}
                                onChange={onEmailChange}
                                autoComplete="email"
                                maxLength={64}
                                required
                                readOnly={isLoading}
                                placeholder="Email Address"
                                value={email}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                className={`w-full px-4 py-2 border rounded-md ${
                                    error ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:border-indigo-500`}
                                onChange={onPasswordChange}
                                autoComplete="current-password"
                                required
                                minLength={8}
                                maxLength={100}
                                readOnly={isLoading}
                                placeholder="Password"
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
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:border-indigo-400"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
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
                        to={LOGIN}
                    >
                        Login instead
                    </Link>
                </div>
                <span className="text-gray-400 text-xs mx-auto text-center block mt-4">
                    &copy; Copyright {new Date().getFullYear()} SocialMedia
                </span>
            </div>
        </div>
    );
};

export default Register;

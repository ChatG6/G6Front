"use client";

import React, { useCallback, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import URLS from "@/app/config/urls";
import { validate_login } from "@/app/lib/formVaild";
import Notify from "@/components/Management/notification";
const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e: MediaQueryListEvent) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addEventListener("change", updateTarget);

    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeEventListener("change", updateTarget);
  }, []);

  return targetReached;
};
// A simple Google icon component
/*const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
        <path d="M1 1h22v22H1z" fill="none"></path>
    </svg>
);*/
const GoogleIcon = () => (
<svg 
style={{
  width:"1.5rem",
  height:"1.5rem",
  margin:"0.75rem",
  left:"0px",
  top:"0px",
  position:"absolute"
}}
width="22" height="23" fill="none"><mask id="a" maskUnits="userSpaceOnUse" x="0" y="0" width="22" height="23"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.7 9.4H11.3v4.4h6c-.6 2.8-3 4.4-6 4.4-3.7 0-6.7-3-6.7-6.8 0-3.7 3-6.7 6.7-6.7 1.5 0 3 .6 4.1 1.5l3.3-3.3C16.7 1 14 0 11.3 0 5 0 0 5.1 0 11.4c0 6.3 5 11.4 11.3 11.4 5.6 0 10.7-4.1 10.7-11.4 0-.6-.1-1.4-.3-2z" fill="#fff"></path></mask><g mask="url(#a)"><path d="M-1 18.2V4.7l8.7 6.7-8.7 6.8z" fill="#FBBC05"></path></g><mask id="b" maskUnits="userSpaceOnUse" x="0" y="0" width="22" height="23"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.7 9.4H11.3v4.4h6c-.6 2.8-3 4.4-6 4.4-3.7 0-6.7-3-6.7-6.8 0-3.7 3-6.7 6.7-6.7 1.5 0 3 .6 4.1 1.5l3.3-3.3C16.7 1 14 0 11.3 0 5 0 0 5.1 0 11.4c0 6.3 5 11.4 11.3 11.4 5.6 0 10.7-4.1 10.7-11.4 0-.6-.1-1.4-.3-2z" fill="#fff"></path></mask><g mask="url(#b)"><path d="M-1 4.7l8.7 6.7 3.6-3.1 12.2-2V-1H-1v5.7z" fill="#EA4335"></path></g><mask id="c" maskUnits="userSpaceOnUse" x="0" y="0" width="22" height="23"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.7 9.4H11.3v4.4h6c-.6 2.8-3 4.4-6 4.4-3.7 0-6.7-3-6.7-6.8 0-3.7 3-6.7 6.7-6.7 1.5 0 3 .6 4.1 1.5l3.3-3.3C16.7 1 14 0 11.3 0 5 0 0 5.1 0 11.4c0 6.3 5 11.4 11.3 11.4 5.6 0 10.7-4.1 10.7-11.4 0-.6-.1-1.4-.3-2z" fill="#fff"></path></mask><g mask="url(#c)"><path d="M-1 18.2l15.3-12 4 .6L23.6-1v24.9H-1v-5.7z" fill="#34A853"></path></g><mask id="d" maskUnits="userSpaceOnUse" x="0" y="0" width="22" height="23"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.7 9.4H11.3v4.4h6c-.6 2.8-3 4.4-6 4.4-3.7 0-6.7-3-6.7-6.8 0-3.7 3-6.7 6.7-6.7 1.5 0 3 .6 4.1 1.5l3.3-3.3C16.7 1 14 0 11.3 0 5 0 0 5.1 0 11.4c0 6.3 5 11.4 11.3 11.4 5.6 0 10.7-4.1 10.7-11.4 0-.6-.1-1.4-.3-2z" fill="#fff"></path></mask><g mask="url(#d)"><path d="M23.5 23.9L7.7 11.4l-2-1.5 17.8-5.2v19.2z" fill="#4285F4"></path></g></svg>
);
const initialErrorMessage = {
  email: "",
  password: "",
};
const initialFormData = {
  email: "",
  password: "",
};
const SignInPage = () => {
  const redirect_url = URLS.urls.main;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState(initialErrorMessage);
  const [notif, setIsNotif] = useState(false);
  const [state, setState] = useState('Login')
  const [msg, setMsg] = useState("")
  const [rememberMe, setRememberMe] = useState(false); // New state for remember me
  const [error, setError] = useState<string | null>(null);
  const isBreakpoint = useMediaQuery(768);
  const handleCredentialsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear previous errors
     if (
        message.email !== "" ||
        message.password !== ""
      ) {
        setMsg("Fix errors to proceed")
        setState("Login")
        setIsNotif(true)
      } else {
          const result = await signIn("credentials", {
      username: formData.email.toString(), // next-auth uses 'username' for the email field by default
      password: formData.password.toString(),
      redirect: false, // Handle redirect manually to show errors
    });
     setState("Logging...")
    if (result?.error) {
        setError("Authentication failed. Please check your credentials.");
        setState("Login")
         setMsg("")
        setIsNotif(false)
    } else if (result?.url) {
        window.location.href = redirect_url;
         setMsg("")
        setIsNotif(false)
    }

      }
 
  };
    const handleChange = (e: { target: { name: any; value: any } }) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: [value],
      }));
    };

  const handleBlur = (e: unknown) => {
    setMessage(validate_login(formData));
  };
  return (
    <div 
    style={{paddingRight:isBreakpoint?"":"60px"}}
    className="flex min-h-screen w-full items-center justify-center p-4">
      {notif && <Notify message={msg} dur={30} display={setIsNotif} />}
      <div className="w-full max-w-md space-y-3">
        <div className="text-center pt-10">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            {/*<p className="mt-2 text-sm text-gray-600">Sign in to continue to your account.</p>*/}
        </div>

        {/* The entire login process is now inside one form */}
        <form 
        style={{border:"1px solid #cee6ff",
          borderRadius:"0.5rem"
        }}
        onSubmit={handleCredentialsSubmit} className="space-y-4 bg-white p-8">
            
            {/* Google Sign-In Button */}
            <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: redirect_url })}
            className="google_login"
            >
                <GoogleIcon />
                Continue with Google
            </button>

            {/* OR Separator */}
           {/* <div className="flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 flex-shrink text-sm font-medium text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>*/}
            <span className="or_login">OR</span>
            {/* Credentials Fields */}
            <div className="space-y-4">
                <div className="email_login_field">
                    <label htmlFor="email" className="email_login_label">Email address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                       // onChange={(e) => setEmail(e.target.value)}
                       onChange={handleChange}
                       onBlur={handleBlur}
                        className="email_login_input_field"
                       placeholder="Email address"
                        required
                    />
                </div>
                <div className="email_login_field">
                    <label htmlFor="password" className="email_login_label">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        value={formData.password}
                         onChange={handleChange}
                       onBlur={handleBlur}
                       // onChange={(e) => setPassword(e.target.value)}
                       className="email_login_input_field"
                       placeholder="Password"
                        required
                    />
                </div>
            </div>

            {/* MODIFIED: Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
                <div 
                style={{
                  marginLeft: "0.2rem",
                //  marginBottom:"2px"
                }}
                className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                    </label>
                </div>
                <div 
                   style={{
                  marginRight: "0.2rem",
                //  marginBottom:"2px"
                }}
                className="text-sm">
                    <button type="button" className="font-medium text-blue-600 hover:underline border-none bg-transparent p-0 cursor-pointer">
                        Forgot password?
                    </button>
                </div>
            </div>

            {/* Error Message Display */}
            {error && <p 
                style={{
                  marginRight: "0.2rem",
                //  marginBottom:"2px"
                }}
            className='text-sm text-red-600'>{error}</p>}

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              borderRadius:"0.25rem",
                backgroundColor: "#323dd6",
                
            }}
            >
                {state}
            </button>
            
            {/* MODIFIED: Terms of Service Note */}
            <p 
             style={{
                  marginRight: "0.2rem",
                //  marginBottom:"2px"
                }}
            className="text-xs text-gray-500">
                By signing in, you acknowledge that you have read and agree to our{' '}
                <Link href="https://g6pro.us/about/" className="font-medium text-blue-600 hover:underline">
                    Terms of Service
                </Link>.
            </p>

            {/* Link to Sign Up */}
            <p 
                   style={{
                  marginRight: "0.2rem",
                //  marginBottom:"2px"
                }}
            className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/authentication/signup" className="font-medium text-blue-600 hover:underline">
                    Register
                </Link>
            </p>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;

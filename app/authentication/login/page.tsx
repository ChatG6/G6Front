"use client";

import React, { useCallback, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import URLS from "@/app/config/urls";
import { validate_login } from "@/app/lib/formVaild";
import Notify from "@/components/Management/notification";
import Captcha from "@/components/Recaptcha";
import { GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
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

// Eye icons for password visibility toggle
const EyeOffIcon = ({...props}) => (
   <svg 
   style={{
    position:"relative",
    top:"0.75rem",
    left:"0.0625rem",
     color:"#a1afc3"
   }}
   width="20" height="14"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M1.6 9.2h0a10 10 0 0116.8 0h0M10 4.6V1.5M6.8 5.1L5.3 2.4M3.7 6.7L1 5.1m12.2 0l1.5-2.7m1.6 4.3L19 5.1"></path><path d="M13.4 8c0 2-1.5 3.5-3.4 3.5A3.5 3.5 0 016.6 8c0-2 1.5-3.5 3.4-3.5s3.4 1.6 3.4 3.5z"></path></g></svg>
);

const EyeIcon = ({...props}) => (
  <svg 
     style={{
    position:"relative",
    top:"0.8rem",
    left:"0.0625rem",
    color:"#a1afc3"
   }}
  width="20" height="14"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M1.6 5.2h0a10 10 0 0016.8 0h0M10 9.8v3M6.8 9.2l-1.5 2.7M3.7 7.6L1 9.2m12.2 0l1.5 2.7m1.6-4.3L19 9.2"></path></g></svg>
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
  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState(initialErrorMessage);
  const [notif, setIsNotif] = useState(false);
  const [state, setState] = useState('Login')
  const [msg, setMsg] = useState("")
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isBreakpoint = useMediaQuery(768);
   // IMPORTANT: Replace this with your actual V3 site key from the Google reCAPTCHA admin console.
    const recaptchaV3SiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    console.log(recaptchaV3SiteKey)
 
  // MODIFIED: Added state for password visibility
  const [showPassword, setShowPassword] = useState(false);
  // ** NEW: useEffect to load the remembered email on component mount **
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedEmail && rememberedPassword) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setFormData(prev => ({ ...prev, password: rememberedPassword }));
      setRememberMe(true);
    }
  }, []); // Empty dependency array ensures this runs only once
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
        if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email.toString());
        localStorage.setItem('rememberedPassword', formData.password.toString());
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');

      }
       setState("Logging...")
          const result = await signIn("credentials", {
      username: formData.email.toString(), // next-auth uses 'username' for the email field by default
      password: formData.password.toString(),
      redirect: false, // Handle redirect manually to show errors
    });
     
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
     if (!recaptchaV3SiteKey) {
        console.error("reCAPTCHA V3 Site Key is not defined. Please check your environment variables.");
        return <div>reCAPTCHA is not configured.</div>;
    }
    
  return (

    <GoogleReCaptchaProvider reCaptchaKey={recaptchaV3SiteKey}>

    
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
                                className={`${message?.email? 'email_login_input_field_invalid':'email_login_input_field'} `}

                       placeholder="Email address"
                        required
                    />
                </div>
                {/* MODIFIED: Wrapped password input in a relative container */}
                <div className="email_login_field" style={{ position: 'relative' }}>
                    <label htmlFor="password" className="email_login_label">Password</label>
                    <input
                        id="password"
                        name="password"
                        // MODIFIED: Dynamic type for password visibility
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={formData.password}
                         onChange={handleChange}
                       onBlur={handleBlur}
                       // onChange={(e) => setPassword(e.target.value)}
                               className={`${message?.password? 'email_login_input_field_invalid':'email_login_input_field'} `}

                       placeholder="Password"
                        required
                    />
                    {/* MODIFIED: Added toggle button */}
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {showPassword ? <EyeOffIcon className="text-gray-500" /> : <EyeIcon className="text-gray-500" />}
                    </button>
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
                    <Link href={"/authentication/reset-password"} className="font-medium text-blue-600 hover:underline border-none bg-transparent p-0 cursor-pointer">
                        Forgot password?
                    </Link>
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
                <Link href="https://g6pro.us/policy/policy.html" className="font-medium text-blue-600 hover:underline">
                    Policy
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
       <Captcha action="homepage" />
    </div>
    </GoogleReCaptchaProvider>
  );
};

export default SignInPage;

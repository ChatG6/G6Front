"use client";

// import "@/app/styles/styles.css";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import validate_newpassword from "@/app/lib/formVaild";
import Notify from "@/components/Management/notification";
import Link from "next/link";
import { verifyUser } from "@/app/lib/Auth";
import validate from "@/app/lib/formVaild";
import Captcha from "@/components/Recaptcha";
import { GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
const initialFormData = {
  username: "",
  email: "",
  password: "",
  passwordC: "",
};
const initialErrorMessage = {
  username: "",
  email: "",
  password: "",
};
// Eye icons for password visibility toggle
const EyeOffIcon = ({...props}) => (
   <svg 
   style={{
    position:"relative",
    top:"0.8rem",
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
const Page: React.FC = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState(initialErrorMessage);
  const [notif, setIsNotif] = useState(false);
  const [state, setState] = useState('Reset password')
  const [msg, setMsg] = useState("")
  const [token, setToken] = useState<string | null>("");
  const [email, setEmail] = useState<string | null>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordc, setShowPasswordc] = useState(false);
  // IMPORTANT: Replace this with your actual V3 site key from the Google reCAPTCHA admin console.
    const recaptchaV3SiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!recaptchaV3SiteKey) {
        console.error("reCAPTCHA V3 Site Key is not defined. Please check your environment variables.");
        return <div>reCAPTCHA is not configured.</div>;
    }
  //const [agreedToTerms, setAgreedToTerms] = useState(false);
   const [verified, setIsVerfied] = useState(false);
 // const success = `We have sent a verification email to:${formData.email.toString()},please check it up and verify your account`;
  useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token");
      const email = params.get("email");
      setToken(urlToken);
      setEmail(email);
    }, [token]);
    useEffect(() => {
      if (token && email) {
        verifyUser(token, email).then((verifyState) => {
          if (verifyState.status === 200) {
            setMsg("Verification done successfully");
            setIsVerfied(true)
            setFormData({
                username: verifyState.data.usr,
  email: email,
  password: "",
  passwordC: "",}
            )
            setIsNotif(true)          
          } else if (verifyState.status === 226) {
            setMsg("Token Expired!");
            setIsVerfied(false)
                      setFormData({
                username: "",
  email: "",
  password: "",
  passwordC: "",}
            )
            setIsNotif(true)          
  
          } else {
            setMsg("Something went wrong, please try again later");
             setIsVerfied(false)
               setFormData({
                username: "",
  email: "",
  password: "",
  passwordC: "",}
            )
            setIsNotif(true)          
          }
        });
      }
    }, [token, email]);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (
        message.email !== "" ||
        message.username !== "" ||
        message.password !== ""
      ) {
        setMsg("Fix errors to proceed")
        setIsNotif(true)
      } else {
        setState('Resetting password...')
       /* const btn:any = document.querySelector(".sign-btn")
        btn.disabled = true*/
        const response = await axios.post("/api/auth/password-reset", {
          email: formData.email.toString(),
          password: formData.password.toString(),
        });
        setState('Reset password')
       /* btn.disabled = false*/

        console.warn(response.data);
        switch (response.status) {
          case 200:
            setIsNotif(true);
            setMsg(response.data.message)
            break;
          case 400:
            if (response.data.message) {
              setMessage({
                username: "",
                email: response.data.message,
                password: "",
              });
            } else {
              setMessage({
                username: response.data.message,
                email: "",
                password: "",
              });
            }
            break;
        }
      }
    } catch (error) {
      console.error("Reset failed:", error);
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
    setMessage(validate(formData));
  };
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaV3SiteKey}>

   
    <div
    // style={{paddingRight:"40px"}}
    className="flex min-h-screen w-full items-center justify-center p-4"
    >
      {notif && <Notify message={msg} dur={30} display={setIsNotif} />}
      <section className="w-full max-w-md space-y-3">
       {verified && (<form 
          style={{border:"1px solid #cee6ff",
          borderRadius:"0.5rem"
        }} 
        className="space-y-2 bg-white p-8"
        onSubmit={onSubmit}>
          {/*<h1>Signup</h1>*/}
    
                <div className="email_login_field">
                    <label 
          className="email_login_label"
          htmlFor="UserName">User Name</label>
          <input
            type="text"
            onBlur={handleBlur}
            placeholder="Username"
            onChange={handleChange}
            value={formData.username}
            name="username"
            className={`${message?.username? 'email_login_input_field_invalid':'email_login_input_field'} `}
            required

          />
          {message.username? <p className="error-message">{message?.username}</p> : <></>}
    {/* <p className="error-message">{message?.username}</p> */}
                </div>
        
      
<div className="email_login_field"> 
 <label 
  className="email_login_label"
 htmlFor="Email">Email</label>
          <input
            type="email"
            onBlur={handleBlur}
            value={formData.email}
            placeholder="Email"
            className={`${message?.email? 'email_login_input_field_invalid':'email_login_input_field'} `}
            onChange={handleChange}
            name="email"
            required
          />
          {message.email? <p className="error-message">{message?.email}</p> : <></>}
          {/* <p className="error-message">{message?.email}</p> */}
</div>
         
<div className="email_login_field"
style={{ position: 'relative' }}
> 
    <label 
      className="email_login_label"
    htmlFor="Password">New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className={`${message?.password? 'email_login_input_field_invalid':'email_login_input_field'} `}
            onBlur={handleBlur}
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            name="password"
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
      
<div className="email_login_field"
style={{ position: 'relative' }}
> 
 <label 
  className="email_login_label"
 htmlFor="ConfirmPassword">Confirm New Password</label>
          <input
            type={showPasswordc ? "text" : "password"}
            className={`${message?.password? 'email_login_input_field_invalid':'email_login_input_field'} `}
            onBlur={handleBlur}
            value={formData.passwordC}
            placeholder="Confirm new password"
            onChange={handleChange}
            name="passwordC"
            required
          />
           {/* MODIFIED: Added toggle button */}
                    <button
                        type="button"
                       onClick={() => setShowPasswordc(!showPasswordc)}
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
                        {showPasswordc ? <EyeOffIcon className="text-gray-500" /> : <EyeIcon className="text-gray-500" />}
                    </button>
         
          {/* <p className="error-message">{message?.password}</p> */}
</div>
 {message.password? <p className="error-message">{message?.password}</p> : <></>}
            {/* Terms of Service Checkbox */}
           {/*<div 
                 style={{
                  marginLeft: "0.2rem",
                  marginBottom:"4px"
                }}
            className="flex items-center">
                <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label 
           
                htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <Link href="https://g6pro.us/about/" className="font-medium text-blue-600 hover:underline">Terms of Service</Link>
                </label>
            </div>*/}
          <button 
          
          disabled={state==='Resetting password...'}
                    className="w-full rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              borderRadius:"0.25rem",
                backgroundColor: "#323dd6",
                marginBottom:"4px"
            }}
          type="submit">{state}</button>
              <p
              className="text-sm text-gray-600"
                  style={{
                  marginLeft: "0.2rem",
                  marginBottom:"4px"
                }}
              >
        Alredy have an account? &nbsp;
        <Link 
        //className="header-link text-violet-500" 
        className="header-link text-blue-600 hover:underline"
        href={"/api/auth/signin"} >
          Login here
        </Link>
      </p>
        </form>)}
    
      </section>
  <Captcha action="homepage" />
    </div>
     </GoogleReCaptchaProvider>
  );
};

export default Page;

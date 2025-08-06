"use client";

// import "@/app/styles/styles.css";
import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import validate from "@/app/lib/formVaild";
import Notify from "@/components/Management/notification";
import Link from "next/link";

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

const Page: React.FC = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState(initialErrorMessage);
  const [notif, setIsNotif] = useState(false);
  const [state, setState] = useState('Sign Up')
  const [msg, setMsg] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const success = `We have sent a verification email to:${formData.email.toString()},please check it up and verify your account`;
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
        setState('Signing Up...')
       /* const btn:any = document.querySelector(".sign-btn")
        btn.disabled = true*/
        const response = await axios.post("/api/auth/signup", {
          usr: formData.username.toString(),
          email: formData.email.toString(),
          pwd: formData.password.toString(),
        });
        setState('Sign Up')
       /* btn.disabled = false*/

        console.warn(response.data);
        switch (response.status) {
          case 201:
            setIsNotif(true);
            setMsg(success)
            break;
          case 226:
            if (response.data.error.username) {
              setMessage({
                username: response.data.error?.username,
                email: "",
                password: "",
              });
            } else {
              setMessage({
                username: "",
                email: response.data.error?.email,
                password: "",
              });
            }
            break;
        }
      }
    } catch (error) {
      console.error("Signup failed:", error);
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
    <div
    // style={{paddingRight:"40px"}}
    className="flex min-h-screen w-full items-center justify-center p-4"
    >
      {notif && <Notify message={msg} dur={30} display={setIsNotif} />}
      <section className="w-full max-w-md space-y-3">
        <form 
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
         
<div className="email_login_field"> 
    <label 
      className="email_login_label"
    htmlFor="Password">Password</label>
          <input
            type="password"
            className={`${message?.password? 'email_login_input_field_invalid':'email_login_input_field'} `}
            onBlur={handleBlur}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            name="password"
            required
          />

</div>
      
<div className="email_login_field"> 
 <label 
  className="email_login_label"
 htmlFor="ConfirmPassword">Confirm Password</label>
          <input
            type="password"
            className={`${message?.password? 'email_login_input_field_invalid':'email_login_input_field'} `}
            onBlur={handleBlur}
            value={formData.passwordC}
            placeholder="Confirm password"
            onChange={handleChange}
            name="passwordC"
            required
          />
          {message.password? <p className="error-message">{message?.password}</p> : <></>}
          {/* <p className="error-message">{message?.password}</p> */}
</div>
            {/* Terms of Service Checkbox */}
            <div 
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
            </div>
          <button 
          
          disabled={!agreedToTerms || state==='Signing Up...'}
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
        </form>
    
      </section>

    </div>
  );
};

export default Page;

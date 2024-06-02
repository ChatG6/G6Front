"use client"

import React, { useState } from 'react'
import { GitHubLogoIcon,LinkedInLogoIcon } from '@radix-ui/react-icons'
import { GoogleOutlined } from '@ant-design/icons'
import validate from "@/app/lib/formVaild";
import axios from "axios";
import Link from "next/link";
import Notify from "@/components/Management/notification";

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

const Page = () => {

    const [formData, setFormData] = useState(initialFormData);
    const [message, setMessage] = useState(initialErrorMessage);
    const [notif, setIsNotif] = useState(false);
    const [state, setState] = useState('Sign Up')
    const [msg, setMsg] = useState("")
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
          const btn:any = document.querySelector(".sign-btn")
          btn.disabled = true
          const response = await axios.post("/api/auth/signup", {
            usr: formData.username.toString(),
            email: formData.email.toString(),
            pwd: formData.password.toString(),
          });
          setState('Sign Up')
          btn.disabled = false
  
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

    const[toggle,setToggle]=useState(false)

  return (
    <div className='h-full flex flex-wrap items-center justify-center content-center w-full'>
        <div className={`container-login w-full h-full  ${toggle &&'active'}`} id="container-login" 
        style={{

        }}
        >
            <div className="form-container sign-up"  >
                <form>
                    <h1>Create Account</h1>
                    <div className="social-icons">
                        <a href="#" className="icon">
                            <GoogleOutlined/>
                        </a>
                        <a href="#" className="icon">
                            <GitHubLogoIcon/>
                        </a>
                        <a href="#" className="icon">
                            <LinkedInLogoIcon/>
                        </a>
                    </div>
                    <span>
                        or use your email for registeration
                    </span>
                    <input
                      type="text"
                      onBlur={handleBlur}
                      placeholder="Username"
                      onChange={handleChange}
                      value={formData.username}
                      name="username"
                      required
                    />

                    <input
                      type="email"
                      onBlur={handleBlur}
                      value={formData.email}
                      placeholder="Email"
                      onChange={handleChange}
                      name="email"
                      required
                    />

                    <input
                      type="password"
                      onBlur={handleBlur}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      name="password"
                      required
                    />
                    <input
                      type="password"
                      onBlur={handleBlur}
                      value={formData.passwordC}
                      placeholder="Confirm password"
                      onChange={handleChange}
                      name="passwordC"
                      required
                    />

                    <button  type="submit">
                        {state}
                    </button>
                </form>
            </div>
            <div className="form-container sign-in">
                <form>
                    <h1>Sign In</h1>
                    <div className="social-icons">
                        <a href="#" className="icon">
                            <GoogleOutlined/> 
                        </a>
                        <a href="#" className="icon">
                            <GitHubLogoIcon/>
                        </a>
                        <a href="#" className="icon">
                            <LinkedInLogoIcon/>
                        </a>
                    </div>
                    <span>
                        or use your email password
                    </span>
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <a href="#">
                        Forget Your Password?
                    </a>
                    <button>
                        Sign In
                    </button>
                </form>
            </div>
            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-right" >
                        <h1>
                            Hello, Friend!
                        </h1>
                        <p>
                            Register with your personal details to use all of site features
                        </p>
                        <button  id="register"                 
                        onClick={
                                ()=>{
                                    setToggle(true)
                                }
                            }>
                            Sign Up
                        </button>
                    </div>
                    <div className="toggle-panel toggle-left">
                        <h1>
                            Welcome Back!
                        </h1>
                        <p>
                            Enter your personal details to use all of site features
                        </p>
                        <button  id="login"
                        onClick={
                            ()=>{
                                setToggle(false)
                            }
                        }>
                            Sign In
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>

  )
}

export default Page


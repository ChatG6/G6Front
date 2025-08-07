"use client"
import { checkReCAPTCHA } from "@/app/lib/Auth";
import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

type RecaptchaProps = {
  action: string;
};

const Captcha: React.FC<RecaptchaProps> = ({ action }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  useEffect(() => {
    const execute = async () => {
      if (!executeRecaptcha) {
        return;
      }
      const token = await executeRecaptcha(action);
      //console.log(token)
      try {
        const resp = await checkReCAPTCHA(token);
        if (resp.success) {
          console.log("reCAPTCHA verified successfully");
        } else {
          console.error("reCAPTCHA verification failed", resp.message);
        }
      } catch (error) {
        console.error("Error verifying reCAPTCHA:", error);
      }
    };

    execute();
  }, [executeRecaptcha, action]);

  return null;
};

export default Captcha;

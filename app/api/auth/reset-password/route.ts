import bcryptjs from "bcryptjs";
import { db } from "@/app/lib/db";
import { sendVerificationMail } from "@/app/lib/mail";
import { NextRequest } from "next/server";
import URLS from "@/app/config/urls";
import { message } from "antd";

async function requestPasswordReset(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Find the user by the provided email address
    const user = await db.user.findUnique({
      where: { email: email },
    });

    // If no user is found, return a 400 error
    if (!user) {
      return Response.json(
        { message: "User with this email does not exist." },
        { status: 400 }
      );
    }
   let usr = "user"
   if (user.name) {
    usr = user.name
   }
    // Generate a new, unique token and set an expiration time (e.g., 10 minutes)
   const token = await bcryptjs.hash(usr.toString() + Date.now(), 10);
    const expire = new Date();
    const expDur = 10; // Token is valid for 10 minutes
    expire.setMinutes(expire.getMinutes() + expDur);

    // Update the user's record in the database with the new token and expiration time
    await db.user.update({
      where: { id: user.id },
      data: {
        token: token,
        expirationTime: expire,
      },
    });

    // Construct the password reset link
    // This assumes you have a page at a URL like '/reset-password'
    const resetUrl = new URL(URLS.urls.reset); 
    resetUrl.searchParams.append("token", token);
    resetUrl.searchParams.append("email", email);

    // Send the email using the existing mail function
    // For a better user experience, you might want to create a separate email template for password resets
    const res = await sendVerificationMail(email, resetUrl, usr, expDur);
    if (res.status==200) {
  return Response.json(
      { message: "Password reset email sent successfully. Please check your inbox." },
      { status: 200 }
    );

  } else {
    return Response.json(
      { message: "Something went wrong, try again later" },
      { status: 226 }
    );
  }
  

  } catch (error) {
    console.error("Error in password reset endpoint:", error);
    return Response.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

export { requestPasswordReset as POST };
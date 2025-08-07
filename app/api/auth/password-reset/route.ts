import bcryptjs from "bcryptjs";
import { db } from "@/app/lib/db";
import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
async function completePasswordReset(req: NextRequest) {
  try {
    // The user should have been verified via a token before reaching this point.
    // This endpoint takes the final new password.
    const { email, password } = await req.json();
    console.log(email)
    console.log(password)
    // Find the user by the provided email address to ensure they exist.
    const user = await db.user.findUnique({
      where: { email: email },
    });

    // If no user is found, return a 400 error.
    if (!user) {
      return Response.json(
        { message: "User with this email does not exist." },
        { status: 400 }
      );
    }

    // Hash the new password before saving it.
    const hashedPassword = await hash(password.toString(), 10);
    console.log(hashedPassword)
    console.log(user.password)
    // Update the user's password in the database.
    if (user.password!=hashedPassword) {
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });}
    else {
        return Response.json(
      { message: "Old password can not be new password" },
      { status: 400 }
    );
    }

    return Response.json(
      { message: "Password has been reset successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in password reset completion endpoint:", error);
    return Response.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

export { completePasswordReset as POST };

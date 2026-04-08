import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { DBConnect } from "@/lib/db";
import User from "@/models/User";
import { sendResetEmail } from "@/lib/mailer";

export async function POST(request) {
  await DBConnect();

  const { email } = await request.json();

  const user = await User.findOne({ email });
  
  if (!user) {
    return NextResponse.json({
      success: true,
      message: "If this email exists, a reset link has been sent."
    })
  }

  if (user.provider === "google") {
      return NextResponse.json(
        { 
          success: false, 
          message: "Please use Google Sign-In for this account" 
        },
        { status: 403 }
      );
    }
  
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });


  const info = { name: user?.name, email: user?.email}
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  



  
  try {
    await sendResetEmail(info, resetLink);
    return NextResponse.json({
      success: true,
      message: "Reset link sent to email",
    });
  } catch (err) {
    console.error("MailerSend error:", err);
    return NextResponse.json({
      success: false,
      message: "Failed to send reset email",
    }, { status: 500 });
  }
}

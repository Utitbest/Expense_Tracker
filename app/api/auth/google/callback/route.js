export const runtime = "nodejs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { DBConnect } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
 
    if (!code) {
      return NextResponse.redirect(new URL("/login?error=no_code", req.url)); 
    }

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await userInfoRes.json();

    await DBConnect();

    let user = await User.findOne({ email: profile.email.toLowerCase() });
    let isNewUser = false;
    if (user) {
      user.provider = "google";
      user.providerId = profile.id;
      user.image = profile.picture;
      user.emailVerified = true;
      await user.save();
    } else {
      user = await User.create({
        name: profile.name,
        email: profile.email.toLowerCase(),
        provider: "google",
        providerId: profile.id,
        image: profile.picture,
        emailVerified: true,
      });
      isNewUser = true;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const redirectUrl = isNewUser 
      ? "/dashboard?welcome=true" 
      : "/dashboard";
    
    const response = NextResponse.redirect(new URL(redirectUrl, req.url));
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    console.log("✅ Google signup/login successful, redirecting to:", redirectUrl);
    // ✅ Return the response here
    await new Promise(resolve => setTimeout(resolve, 100));
    return response;

  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(new URL("/login?error=google_failed", req.url));
  }
}

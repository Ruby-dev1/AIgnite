import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { name, email, password, bio, role } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            bio,
            role,
            verificationToken,
        });

        await newUser.save();

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const verificationUrl = `${appUrl}/api/auth/verify?token=${verificationToken}&email=${email}`;

        const mailOptions = {
            from: `"AIgnite Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email - AIgnite",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4f46e5; text-align: center;">Welcome to AIgnite!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for joining AIgnite. Please verify your email address to get started with your professional adventure.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
          </div>
          <p>If you did not create an account, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666; text-align: center;">&copy; 2026 AIgnite. All rights reserved.</p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "User registered. Please check your email to verify your account." }, { status: 201 });
    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

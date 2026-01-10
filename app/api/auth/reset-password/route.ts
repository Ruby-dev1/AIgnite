import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { token, email, password } = await req.json();

        if (!token || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            email,
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // Automatically verify user if they reset their password (though they should already be verified)
        if (!user.isVerified) user.isVerified = true;

        await user.save();

        return NextResponse.json({ message: "Password has been reset successfully. You can now log in." }, { status: 200 });
    } catch (error: any) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

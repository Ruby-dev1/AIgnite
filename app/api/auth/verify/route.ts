import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET(req: Request) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");
        const email = searchParams.get("email");

        if (!token || !email) {
            return NextResponse.json({ error: "Missing token or email" }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email, verificationToken: token });

        if (!user) {
            return NextResponse.json({ error: "Invalid token or email" }, { status: 400 });
        }

        if (user.isVerified) {
            return NextResponse.redirect(`${appUrl}/?verified=true`);
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        return NextResponse.redirect(`${appUrl}/?verified=true`);
    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.redirect(`${appUrl}/?verified=true`);
    }
}

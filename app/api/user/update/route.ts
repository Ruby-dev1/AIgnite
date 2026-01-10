import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        let decoded: any;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (err) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const updatedData = await req.json();
        await dbConnect();

        // Prevent sensitivity fields from being updated directly if needed
        // For now, we trust the updateProfile logic on the frontend to send correct XP/Level
        // but in a production app, we should calculate progress on the server.

        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { $set: updatedData },
            { new: true }
        ).select("-password -verificationToken");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            user,
        }, { status: 200 });
    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

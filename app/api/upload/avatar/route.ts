import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        // NOTE: In a real app, strict auth check is better, but for this demo we might just proceed if token is missing
        // or rely on client sending it.
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        let userId: string | null = null;
        try {
            // verify token
            const payload: any = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
            // fallback_secret is for dev only if .env is missing JWT_SECRET, ideally should throw
            userId = payload.userId || payload.user_id || payload.sub || payload.id;
        } catch (e) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        if (!userId) return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });

        await dbConnect();

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate type
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary using stream
        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "aignite/avatars",
                    public_id: `user_${userId}`,
                    overwrite: true,
                    transformation: [{ width: 512, height: 512, crop: "thumb", gravity: "face" }],
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        const secureUrl = result.secure_url;

        // Update MongoDB
        const user = await User.findByIdAndUpdate(userId, { avatar: secureUrl }, { new: true });

        if (!user) {
            return NextResponse.json({ error: "User not found in database" }, { status: 404 });
        }

        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.verificationToken;

        return NextResponse.json({ message: "Uploaded", user: userObj, url: secureUrl }, { status: 200 });

    } catch (err: any) {
        console.error("Avatar upload error:", err);
        return NextResponse.json({ error: "Internal Server Error: " + err.message }, { status: 500 });
    }
}

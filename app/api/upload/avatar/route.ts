import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false,
    },
};

function parseForm(req: Request): Promise<{ fields: any; files: any }> {
    return new Promise((resolve, reject) => {
        const form = formidable({ multiples: false, maxFileSize: 5 * 1024 * 1024 });
        // @ts-ignore: Next's Request is compatible here in Node environment
        form.parse((req as any).raw ?? (req as any), (err: any, fields: any, files: any) => {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });
}

export async function POST(req: Request) {
    try {
        const auth = req.headers.get("authorization") || "";
        const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = payload.userId || payload.user_id || payload.sub;
        if (!userId) return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });

        await dbConnect();

        const { files } = await parseForm(req);
        const file = files?.file || files?.avatar || files?.image;
        if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

        // formidable may return single file object or array
        const uploaded = Array.isArray(file) ? file[0] : file;

        // Validate mime type
        const mime = uploaded.mimetype || uploaded.type || '';
        const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!allowed.includes(mime)) {
            return NextResponse.json({ error: "Unsupported image type. Use PNG, JPG or WEBP." }, { status: 400 });
        }

        // Ensure size
        const size = uploaded.size || uploaded.fileSize || 0;
        const MAX_BYTES = 5 * 1024 * 1024;
        if (size > MAX_BYTES) {
            return NextResponse.json({ error: "Image too large (max 5MB)" }, { status: 400 });
        }

        // Configure Cloudinary
        cloudinary.config({ url: process.env.CLOUDINARY_URL });

        // Upload from temp filepath
        const path = uploaded.filepath || uploaded.path || uploaded.filePath;
        if (!path || !fs.existsSync(path)) {
            return NextResponse.json({ error: "Uploaded file not found on server" }, { status: 500 });
        }

        const uploadResult = await cloudinary.uploader.upload(path, {
            folder: "aignite/avatars",
            public_id: `user_${userId}`,
            overwrite: true,
            transformation: [{ width: 512, height: 512, crop: "thumb", gravity: "face" }],
        });

        const secureUrl = uploadResult.secure_url;

        const user = await User.findByIdAndUpdate(userId, { avatar: secureUrl }, { new: true });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.verificationToken;

        return NextResponse.json({ message: "Uploaded", user: userObj }, { status: 200 });
    } catch (err: any) {
        console.error("Avatar upload error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

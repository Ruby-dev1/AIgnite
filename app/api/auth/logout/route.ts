import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json(
        { message: "Logged out successfully" },
        { status: 200 }
    );

    // Clear the auth-token cookie
    response.cookies.set({
        name: "auth-token",
        value: "",
        httpOnly: true,
        expires: new Date(0),
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });

    return response;
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Get authorization header
        const authHeader = req.headers.get("authorization");
        let currentUserId: string | null = null;

        // Try to get current user ID from token
        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
                currentUserId = decoded.userId;
            } catch (error) {
                // Token invalid or expired, continue without user ID
            }
        }

        // Fetch top 10 users sorted by XP
        const topUsers = await User.find()
            .select("name avatar level xp completedChallenges")
            .sort({ xp: -1 })
            .limit(10)
            .lean();

        // Add rank to each user
        const leaderboard = topUsers.map((user, index) => ({
            _id: user._id.toString(),
            name: user.name,
            avatar: user.avatar || null,
            level: user.level,
            xp: user.xp,
            completedChallenges: user.completedChallenges,
            rank: index + 1,
            isCurrentUser: currentUserId ? user._id.toString() === currentUserId : false
        }));

        // If current user is not in top 10, find their rank
        let currentUserRank = null;
        if (currentUserId && !leaderboard.some(u => u.isCurrentUser)) {
            const currentUser = await User.findById(currentUserId)
                .select("name avatar level xp completedChallenges")
                .lean();

            if (currentUser) {
                // Count how many users have more XP
                const usersAbove = await User.countDocuments({ xp: { $gt: currentUser.xp } });

                currentUserRank = {
                    _id: currentUser._id.toString(),
                    name: currentUser.name,
                    avatar: currentUser.avatar || null,
                    level: currentUser.level,
                    xp: currentUser.xp,
                    completedChallenges: currentUser.completedChallenges,
                    rank: usersAbove + 1,
                    isCurrentUser: true
                };
            }
        }

        return NextResponse.json({
            leaderboard,
            currentUserRank,
            totalUsers: await User.countDocuments()
        });
    } catch (error) {
        console.error("Leaderboard error:", error);
        return NextResponse.json(
            { error: "Failed to fetch leaderboard" },
            { status: 500 }
        );
    }
}

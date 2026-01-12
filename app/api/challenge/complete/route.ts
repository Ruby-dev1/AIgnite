import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";
import { ALL_CHALLENGES, BADGE_CRITERIA } from "@/lib/challenges-data";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (err) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const { challengeId } = await req.json();

        const challenge = ALL_CHALLENGES.find(c => c.id === challengeId);
        if (!challenge) {
            return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
        }

        await dbConnect();

        // Fetch user first to check if already completed
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.completedChallengeIds.includes(challengeId)) {
            return NextResponse.json({ message: "Already completed", user }, { status: 200 });
        }

        // Calculate Field ID
        const categoryToFieldMap: Record<string, string> = {
            "Tech": "it",
            "Health": "health",
            "Business": "business",
            "Design": "fashion",
            "Arts": "arts"
        };
        const fieldId = categoryToFieldMap[challenge.category];

        // Prepare Update Operations
        const updateOps: any = {
            $inc: {
                xp: challenge.points,
                completedChallenges: 1
            },
            $addToSet: {
                completedChallengeIds: challengeId
            }
        };

        if (fieldId) {
            updateOps.$inc[`fieldXp.${fieldId}`] = challenge.points;
        }

        // Perform atomic update
        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId,
            updateOps,
            { new: true }
        );

        // Post-update: Check for Level Up and Badges
        // We do this after the atomic increment to get the new values
        // Note: Field updates were atomic, but logic like "Level Up" depends on values.

        let needsSave = false;

        // Level Up Logic
        if (updatedUser.xp >= updatedUser.maxXp) {
            while (updatedUser.xp >= updatedUser.maxXp) {
                updatedUser.level += 1;
                updatedUser.maxXp = (updatedUser.maxXp * 2) + 100;
            }
            needsSave = true;
        }

        // Badge Logic
        if (!updatedUser.unlockedBadges) updatedUser.unlockedBadges = [];

        Object.entries(BADGE_CRITERIA).forEach(([badgeName, criteriaIds]) => {
            // @ts-ignore
            const hasCompletedAll = criteriaIds.every((id: number) => updatedUser.completedChallengeIds.includes(id));

            if (hasCompletedAll && !updatedUser.unlockedBadges.includes(badgeName)) {
                updatedUser.unlockedBadges.push(badgeName);
                updatedUser.badges = updatedUser.unlockedBadges.length;
                needsSave = true;
            }
        });

        if (needsSave) {
            await updatedUser.save();
        }

        // Return cleaned user object
        const userObj = updatedUser.toObject();
        delete userObj.password;
        delete userObj.verificationToken;

        return NextResponse.json({
            message: "Challenge completed",
            user: userObj,
        }, { status: 200 });

    } catch (error: any) {
        console.error("Challenge completion error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

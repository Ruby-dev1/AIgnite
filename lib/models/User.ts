import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "Self-driven learner exploring the future of work." },
    role: { type: String, default: "High School Senior" },
    avatar: { type: String },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    maxXp: { type: Number, default: 1000 },
    badges: { type: Number, default: 0 },
    completedChallenges: { type: Number, default: 0 },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    academics: {
        gpa: { type: String },
        favoriteSubjects: { type: [String], default: [] }
    },
    ecas: { type: [String], default: [] },
    onboardingCompleted: { type: Boolean, default: false },
    primaryCareer: { type: String },
    fieldXp: {
        type: Map,
        of: Number,
        default: {
            it: 0,
            health: 0,
            business: 0,
            fashion: 0,
            arts: 0,
        },
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true });

const User = models.User || model("User", UserSchema);

export default User;

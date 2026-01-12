import mongoose, { Schema, model, models } from "mongoose";

const ProgressSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    maxXp: { type: Number, default: 1000 },
    badges: { type: Number, default: 0 },
    completedChallengeIds: { type: [Number], default: [] },
    fieldXp: {
        type: Map,
        of: Number,
        default: {
            "IT & Technology": 0,
            "Health Sciences": 0,
            "Business": 0,
            "Fashion & Design": 0,
            "Arts & Creative": 0,
        },
    },
}, { timestamps: true, collection: "progresses" });

const Progress = models.Progress || model("Progress", ProgressSchema);

export default Progress;

export interface BadgeRequirement {
    id: number;
    name: string;
    icon: string;
    description: string;
    requiredChallengeIds: number[];
}

export const BADGE_REQUIREMENTS: BadgeRequirement[] = [
    {
        id: 1,
        name: "Code Master",
        icon: "⚡",
        description: "Complete all introductory Tech challenges",
        requiredChallengeIds: [1, 2, 3]
    },
    {
        id: 2,
        name: "Problem Solver",
        icon: "🧩",
        description: "Complete complex simulations and audits",
        requiredChallengeIds: [4, 16, 17]
    },
    {
        id: 3,
        name: "Quick Learner",
        icon: "🚀",
        description: "Complete foundational quiz and practical sets",
        requiredChallengeIds: [5, 11, 8]
    },
    {
        id: 4,
        name: "Team Player",
        icon: "👥",
        description: "Complete collaborative project simulations",
        requiredChallengeIds: [6, 12, 19]
    },
    {
        id: 5,
        name: "Creative Mind",
        icon: "🎨",
        description: "Complete the full Arts & Design project set",
        requiredChallengeIds: [13, 14, 15]
    },
    {
        id: 6,
        name: "Leader in Making",
        icon: "👑",
        description: "Complete high-impact Business challenges",
        requiredChallengeIds: [7, 9, 18]
    },
];

export const calculateUnlockedBadgesCount = (completedIds: number[]): number => {
    return BADGE_REQUIREMENTS.filter(badge =>
        badge.requiredChallengeIds.every(id => completedIds.includes(id))
    ).length;
};

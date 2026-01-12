"use client"

export interface UserProfile {
    id: string
    _id?: string // MongoDB ID
    name: string
    email: string
    bio: string
    role: string
    avatar?: string
    level: number
    xp: number
    maxXp: number
    badges: number
    completedChallenges: number
    completedChallengeIds: number[]
    skills: string[]
    interests: string[]
    academics?: {
        gpa: string;
        favoriteSubjects: string[];
    }
    ecas?: string[]
    onboardingCompleted: boolean
    primaryCareer?: string
    fieldXp: Record<string, number>
    isVerified?: boolean
    unlockedBadges?: string[]
}

const SESSION_KEY = "aignite_session"
const TOKEN_KEY = "aignite_token"
export const SESSION_UPDATED_EVENT = "aignite_session_updated"

export const AuthService = {
    signup: async (name: string, email: string, password: string, bio: string, role: string): Promise<{ message?: string; error?: string }> => {
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, bio, role }),
            })
            const data = await response.json()
            return data
        } catch (error) {
            return { error: "Failed to sign up. Please try again." }
        }
    },

    forgotPassword: async (email: string): Promise<{ message?: string; error?: string }> => {
        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await response.json()
            return data
        } catch (error) {
            return { error: "Failed to send reset email. Please try again." }
        }
    },

    resetPassword: async (token: string, email: string, password: string): Promise<{ message?: string; error?: string }> => {
        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, email, password }),
            })
            const data = await response.json()
            return data
        } catch (error) {
            return { error: "Failed to reset password. Please try again." }
        }
    },

    login: async (email: string, password: string): Promise<{ user?: UserProfile; error?: string }> => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })
            const data = await response.json()
            if (response.ok && data.user) {
                AuthService.setSession(data.user)
            }
            return data
        } catch (error) {
            return { error: "Failed to login. Please try again." }
        }
    },

    setSession: (user: UserProfile) => {
        if (typeof window === "undefined") return
        localStorage.setItem(SESSION_KEY, JSON.stringify(user))
        window.dispatchEvent(new CustomEvent(SESSION_UPDATED_EVENT, { detail: user }))
    },

    getSession: (): UserProfile | null => {
        if (typeof window === "undefined") return null
        const data = localStorage.getItem(SESSION_KEY)
        return data ? JSON.parse(data) : null
    },

    // Token is now managed by HttpOnly cookie, so we can't access it via JS.
    // This function is kept for backward compatibility but returns null or unused.
    getToken: (): string | null => {
        return null;
    },

    logout: async () => {
        if (typeof window === "undefined") return

        try {
            // Call API to clear cookie
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (error) {
            console.error("Logout error:", error);
        }

        localStorage.removeItem(SESSION_KEY)
        localStorage.removeItem(TOKEN_KEY)
        window.dispatchEvent(new CustomEvent(SESSION_UPDATED_EVENT, { detail: null }))
    },

    updateProfile: async (updatedData: Partial<UserProfile>): Promise<UserProfile | null> => {
        const session = AuthService.getSession()
        if (!session) return null

        let updatedUser = {
            ...session,
            ...updatedData,
            fieldXp: updatedData.fieldXp ? { ...session.fieldXp, ...updatedData.fieldXp } : session.fieldXp
        }

        // Level Up Logic
        while (updatedUser.xp >= updatedUser.maxXp) {
            updatedUser.level += 1
            updatedUser.maxXp = (updatedUser.maxXp * 2) + 100
        }

        // Check for Badges (Hall of Fame)
        // Ensure unlockedBadges is initialized
        if (!updatedUser.unlockedBadges) {
            updatedUser.unlockedBadges = [];
        }

        // Import dynamically to avoid circular dependency if any, or just used here
        const { BADGE_CRITERIA } = require("./challenges-data");

        // Check all badge criteria
        Object.entries(BADGE_CRITERIA).forEach(([badgeName, criteriaIds]) => {
            // Check if user has completed all required challenges for this badge
            // @ts-ignore
            const hasCompletedAll = criteriaIds.every((id: number) => updatedUser.completedChallengeIds.includes(id));

            // If completed and not already unlocked, unlock it
            if (hasCompletedAll && !updatedUser.unlockedBadges!.includes(badgeName)) {
                updatedUser.unlockedBadges!.push(badgeName);
                updatedUser.badges = updatedUser.unlockedBadges!.length;
                // Optional: Fire a "Badge Unlocked" toast/event here if frontend logic allows
            }
        });

        // Sync with MongoDB - Cookie is sent automatically
        try {
            await fetch("/api/user/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            });
        } catch (error) {
            console.error("Failed to sync progress with database:", error);
        }

        AuthService.setSession(updatedUser)

        return updatedUser
    },

    refreshSession: async (): Promise<UserProfile | null> => {
        try {
            const response = await fetch("/api/auth/me");
            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    AuthService.setSession(data.user);
                    return data.user;
                }
            }
        } catch (error) {
            console.error("Failed to refresh session:", error);
        }
        return null;
    },

    completeChallenge: async (challengeId: number): Promise<UserProfile | null> => {
        try {
            const response = await fetch("/api/challenge/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ challengeId }),
            });

            const data = await response.json();

            if (response.ok && data.user) {
                AuthService.setSession(data.user);
                return data.user;
            }
        } catch (error) {
            console.error("Failed to complete challenge:", error);
        }
        return null;
    }
}

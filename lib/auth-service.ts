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
}

const SESSION_KEY = "aignite_session"
const TOKEN_KEY = "aignite_token"

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

    login: async (email: string, password: string): Promise<{ user?: UserProfile; token?: string; error?: string }> => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })
            const data = await response.json()
            if (response.ok && data.user && data.token) {
                AuthService.setSession(data.user, data.token)
            }
            return data
        } catch (error) {
            return { error: "Failed to login. Please try again." }
        }
    },

    setSession: (user: UserProfile, token?: string) => {
        if (typeof window === "undefined") return
        localStorage.setItem(SESSION_KEY, JSON.stringify(user))
        if (token) {
            localStorage.setItem(TOKEN_KEY, token)
        }
    },

    getSession: (): UserProfile | null => {
        if (typeof window === "undefined") return null
        const data = localStorage.getItem(SESSION_KEY)
        return data ? JSON.parse(data) : null
    },

    getToken: (): string | null => {
        if (typeof window === "undefined") return null
        return localStorage.getItem(TOKEN_KEY)
    },

    logout: () => {
        if (typeof window === "undefined") return
        localStorage.removeItem(SESSION_KEY)
        localStorage.removeItem(TOKEN_KEY)
    },

    updateProfile: async (updatedData: Partial<UserProfile>): Promise<UserProfile | null> => {
        const session = AuthService.getSession()
        if (!session) return null

        let updatedUser = {
            ...session,
            ...updatedData,
            fieldXp: updatedData.fieldXp ? { ...session.fieldXp, ...updatedData.fieldXp } : session.fieldXp
        }

        // Level Up Logic - Exponential XP Progression
        // Formula: maxXp = (previous maxXp × 2) + 100
        // Progression: 1000 → 2100 → 4300 → 8700 → 17500...

        while (updatedUser.xp >= updatedUser.maxXp) {
            updatedUser.level += 1
            // New maxXp = (previous maxXp × 2) + 100
            updatedUser.maxXp = (updatedUser.maxXp * 2) + 100
        }

        // Sync with MongoDB
        const token = AuthService.getToken();
        if (token) {
            try {
                await fetch("/api/user/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedUser),
                });
            } catch (error) {
                console.error("Failed to sync progress with database:", error);
            }
        }

        AuthService.setSession(updatedUser)

        return updatedUser
    }
}

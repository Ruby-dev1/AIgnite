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
    skills: string[]
    interests: string[]
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

        // Level Up Logic
        while (updatedUser.xp >= updatedUser.maxXp) {
            updatedUser.xp -= updatedUser.maxXp
            updatedUser.level += 1
            updatedUser.maxXp = Math.floor(updatedUser.maxXp * 1.2)
        }

        // Note: For now, we still save profile updates to local session. 
        // In a full implementation, you'd have an API route to update the MongoDB user too.
        AuthService.setSession(updatedUser)

        // TODO: Implement API route for profile updates to persist in MongoDB
        /*
        const token = AuthService.getToken();
        await fetch("/api/user/update", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedUser),
        });
        */

        return updatedUser
    }
}

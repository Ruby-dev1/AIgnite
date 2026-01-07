"use client"

export interface UserProfile {
    id: string
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
}

const STORAGE_KEY = "aignite_users"
const SESSION_KEY = "aignite_session"

export const AuthService = {
    getUsers: (): UserProfile[] => {
        if (typeof window === "undefined") return []
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : []
    },

    saveUsers: (users: UserProfile[]) => {
        if (typeof window === "undefined") return
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
    },

    signup: (name: string, email: string, bio: string, role: string): UserProfile | null => {
        const users = AuthService.getUsers()
        if (users.find(u => u.email === email)) return null

        const newUser: UserProfile = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            bio: bio || "Self-driven learner exploring the future of work.",
            role: role || "High School Senior",
            level: 1,
            xp: 0,
            maxXp: 1000,
            badges: 0,
            completedChallenges: 0,
            skills: [],
            interests: [],
            onboardingCompleted: false
        }

        AuthService.saveUsers([...users, newUser])
        AuthService.setSession(newUser)
        return newUser
    },

    login: (email: string): UserProfile | null => {
        const users = AuthService.getUsers()
        const user = users.find(u => u.email === email)
        if (user) {
            AuthService.setSession(user)
            return user
        }
        return null
    },

    setSession: (user: UserProfile) => {
        if (typeof window === "undefined") return
        localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    },

    getSession: (): UserProfile | null => {
        if (typeof window === "undefined") return null
        const data = localStorage.getItem(SESSION_KEY)
        return data ? JSON.parse(data) : null
    },

    logout: () => {
        if (typeof window === "undefined") return
        localStorage.removeItem(SESSION_KEY)
    },

    updateProfile: (updatedData: Partial<UserProfile>): UserProfile | null => {
        const session = AuthService.getSession()
        if (!session) return null

        const updatedUser = { ...session, ...updatedData }
        AuthService.setSession(updatedUser)

        const users = AuthService.getUsers()
        const updatedUsers = users.map(u => u.id === session.id ? updatedUser : u)
        AuthService.saveUsers(updatedUsers)

        return updatedUser
    }
}

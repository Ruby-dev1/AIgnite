import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

export interface UserProfile {
    academics: {
        gpa: string
        favoriteSubjects: string[]
    }
    interests: string[]
    skills: string[]
    ecas: string[]
}

export interface CareerRecommendation {
    careerPath: string
    description: string
    reasoning: string
    recommendedSkills: string[]
    potentialRoles: string[]
}

export async function generateCareerPath(profile: UserProfile): Promise<CareerRecommendation> {
    // Fallback for development if no key is present (though we just added it)
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        console.warn("No API Key found, returning mock data")
        return getMockRecommendation(profile)
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })

        const prompt = `
      Act as an expert career counselor for high school graduates. 
      Analyze the following student profile and recommend the SINGLE BEST career path for them.
      
      Profile:
      - Academics: GPA ${profile.academics.gpa}, Favorites: ${profile.academics.favoriteSubjects.join(", ")}
      - Interests: ${profile.interests.join(", ")}
      - Skills: ${profile.skills.join(", ")}
      - Extracurriculars: ${profile.ecas.join(", ")}

      Return the response in strictly valid JSON format with the following structure:
      {
        "careerPath": "Title of the career path",
        "description": "A simplified, inspiring description of what this career involves.",
        "reasoning": "Why this fits their specific profile (cite their interests/skills).",
        "recommendedSkills": ["Skill 1", "Skill 2", "Skill 3"],
        "potentialRoles": ["Role 1", "Role 2", "Role 3"]
      }
      Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
    `

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Cleanup potential markdown if Gemini adds it despite instructions
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim()

        return JSON.parse(cleanText) as CareerRecommendation

    } catch (error) {
        console.error("Error generating career path:", error)
        return getMockRecommendation(profile)
    }
}

export async function chatWithAI(message: string, history: { role: "user" | "ai", content: string }[]): Promise<string> {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        return "I'm in offline mode right now, but I can tell you that following your passion is always a good start!"
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })

        const chatHistory = history.map(m => ({
            role: m.role === "ai" ? "model" : "user",
            parts: [{ text: m.content }],
        }))

        // Gemini requires the first message in history to be from the user.
        // If the first message is a greeting from the AI, we skip it for history context.
        if (chatHistory.length > 0 && chatHistory[0].role === "model") {
            chatHistory.shift()
        }

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 500,
            },
        })

        const systemCtxt = "You are AIgnite's Career Advisor. Provide helpful, encouraging, and specific career advice. Keep responses concise and use an optimistic tone."

        try {
            const result = await chat.sendMessage(`${systemCtxt}\n\nUser: ${message}`)
            const response = await result.response
            return response.text()
        } catch (error: any) {
            console.error("Gemini AI Error:", error)
            if (error.message?.includes("429") || error.message?.includes("quota")) {
                throw new Error("QUOTA_EXCEEDED")
            }
            throw error
        }
    } catch (error: any) {
        console.error("AI Career Service Error:", error)
        throw error
    }
}

function getMockRecommendation(profile: UserProfile): CareerRecommendation {
    // Simple heuristic for mock
    const isTech = profile.interests.some(i => i.toLowerCase().includes("tech") || i.toLowerCase().includes("game"))

    if (isTech) {
        return {
            careerPath: "Software Engineering & AI",
            description: "Building the future through code and intelligent systems.",
            reasoning: "Your interest in technology and problem-solving makes this a perfect fit.",
            recommendedSkills: ["Python", "Algorithms", "System Design"],
            potentialRoles: ["Frontend Dev", "AI Engineer", "Game Developer"]
        }
    }

    return {
        careerPath: "Digital Creative Design",
        description: "Visualizing ideas and creating compelling user experiences.",
        reasoning: "Your creative interests suggest a career in design would be fulfilling.",
        recommendedSkills: ["UI/UX", "Graphic Design", "Storytelling"],
        potentialRoles: ["Product Designer", "Art Director", "Brand Strategist"]
    }
}

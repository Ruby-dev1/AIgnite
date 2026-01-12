export interface Challenge {
    id: number
    title: string
    points: number
    type: "simulation" | "quiz" | "practical" | "project"
    difficulty: "Beginner" | "Intermediate" | "Advanced"
    category: string
    description: string
    scenario?: string
    questions?: {
        q: string
        options: string[]
        correct: number
    }[]
}

export const ALL_CHALLENGES: Challenge[] = [
    {
        id: 1,
        title: "Build Your First Website",
        points: 100,
        type: "simulation",
        difficulty: "Beginner",
        category: "Tech",
        description: "Create a simple portfolio website using HTML and CSS",
        questions: [
            {
                q: "What is HTML primarily used for?",
                options: ["Styling", "Structure & Content", "Animations", "Databases"],
                correct: 1,
            },
            {
                q: "Which tag defines a paragraph?",
                options: ["<para>", "<p>", "<paragraph>", "<text>"],
                correct: 1,
            },
            {
                q: "What does CSS stand for?",
                options: ["Computer Style Sheet", "Cascading Style Sheet", "Creative Style System", "Code Style Service"],
                correct: 1,
            },
        ],
    },
    {
        id: 2,
        title: "Debug a Real App",
        points: 150,
        type: "practical",
        difficulty: "Intermediate",
        category: "Tech",
        description: "Fix bugs in a real application and learn debugging techniques",
        scenario: "A user registration form is not working. Find and fix 3 bugs in the code.",
    },
    {
        id: 3,
        title: "Create an API",
        points: 200,
        type: "project",
        difficulty: "Advanced",
        category: "Tech",
        description: "Build a REST API that manages a list of tasks",
    },
    {
        id: 4,
        title: "Patient Case Study",
        points: 100,
        type: "simulation",
        difficulty: "Beginner",
        category: "Health",
        description: "Analyze a patient case and recommend treatment",
        scenario: "Patient presents with symptoms. What diagnosis would you suggest?",
    },
    {
        id: 5,
        title: "Medical Quiz Challenge",
        points: 120,
        type: "quiz",
        difficulty: "Beginner",
        category: "Health",
        description: "Test your medical knowledge",
        questions: [
            {
                q: "What is the normal human body temperature?",
                options: ["36.5°C", "37.5°C", "38.5°C", "35.5°C"],
                correct: 0,
            },
            {
                q: "How many bones are in an adult human body?",
                options: ["186", "206", "216", "196"],
                correct: 1,
            },
            {
                q: "What is the largest organ in the human body?",
                options: ["Heart", "Brain", "Skin", "Liver"],
                correct: 2,
            },
        ],
    },
    {
        id: 6,
        title: "Health Campaign Design",
        points: 150,
        type: "project",
        difficulty: "Intermediate",
        category: "Health",
        description: "Design a community health awareness campaign",
    },
    {
        id: 7,
        title: "Startup Pitch Challenge",
        points: 150,
        type: "simulation",
        difficulty: "Intermediate",
        category: "Business",
        description: "Create and pitch a business idea to investors",
    },
    {
        id: 8,
        title: "Market Analysis",
        points: 120,
        type: "practical",
        difficulty: "Beginner",
        category: "Business",
        description: "Analyze market trends for a new product",
    },
    {
        id: 9,
        title: "Business Plan Competition",
        points: 200,
        type: "project",
        difficulty: "Advanced",
        category: "Business",
        description: "Develop a comprehensive business plan for a new startup idea.",
    },
    {
        id: 10,
        title: "Design Your Collection",
        points: 130,
        type: "project",
        difficulty: "Intermediate",
        category: "Design",
        description: "Design a 5-piece fashion collection",
    },
    {
        id: 11,
        title: "Style Quiz Challenge",
        points: 100,
        type: "quiz",
        difficulty: "Beginner",
        category: "Design",
        description: "Test your fashion design knowledge",
    },
    {
        id: 12,
        title: "Runway Show Planning",
        points: 180,
        type: "practical",
        difficulty: "Intermediate",
        category: "Design",
        description: "Plan and coordinate a fashion runway event.",
    },
    {
        id: 13,
        title: "Create an Artwork",
        points: 140,
        type: "project",
        difficulty: "Intermediate",
        category: "Arts",
        description: "Create digital art inspired by a theme",
    },
    {
        id: 14,
        title: "Story Illustration Challenge",
        points: 160,
        type: "practical",
        difficulty: "Intermediate",
        category: "Arts",
        description: "Illustrate a key scene from a given short story.",
    },
    {
        id: 15,
        title: "Animation Mini-Project",
        points: 170,
        type: "project",
        difficulty: "Intermediate",
        category: "Arts",
        description: "Create a brief 2D animation sequence based on a character design.",
    },
    {
        id: 16,
        title: "UI/UX Audit",
        points: 180,
        type: "practical",
        difficulty: "Intermediate",
        category: "Design",
        description: "Perform a usability audit on a popular mobile app",
    },
    {
        id: 17,
        title: "Data Visualization",
        points: 200,
        type: "project",
        difficulty: "Advanced",
        category: "Tech",
        description: "Turn raw complex data into an interactive dashboard",
    },
    {
        id: 18,
        title: "Ethical Leadership Case",
        points: 110,
        type: "simulation",
        difficulty: "Beginner",
        category: "Business",
        description: "Solve a complex ethical dilemma in a corporate setting",
    },
    {
        id: 19,
        title: "Public Speaking Simulator",
        points: 140,
        type: "simulation",
        difficulty: "Intermediate",
        category: "Business",
        description: "Deliver a 5-minute pitch in a virtual room",
    }
]

export const getChallengeById = (id: number): Challenge | undefined => {
    return ALL_CHALLENGES.find(c => c.id === id)
}

export const BADGE_CRITERIA = {
    "Code Master": [1, 2, 3],
    "Problem Solver": [4, 16, 17],
    "Quick Learner": [5, 11, 8],
    "Team Player": [6, 12, 19],
    "Creative Mind": [13, 14, 15],
    "Leader in Making": [7, 9, 18],
};

export const BADGE_DETAILS = [
    { id: 1, name: "Code Master", icon: "⚡", description: "Complete core technical set: Website, Debugging, API" },
    { id: 2, name: "Problem Solver", icon: "🧩", description: "Complete analytical tasks: Case Study, UI/UX, Data Viz" },
    { id: 3, name: "Quick Learner", icon: "🚀", description: "Complete foundational quizzes in Medical, Style, Market" },
    { id: 4, name: "Team Player", icon: "👥", description: "Complete collaborative projects: Health Campaign, Runway, Public Speaking" },
    { id: 5, name: "Creative Mind", icon: "🎨", description: "Complete Arts set: Artwork, Illustration, Animation" },
    { id: 6, name: "Leader in Making", icon: "👑", description: "Complete Business set: Pitch, Plan, Ethics Case" },
];

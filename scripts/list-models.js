const fs = require('fs');
const path = require('path');

async function listModels() {
    let key = "";
    try {
        const envPath = path.resolve(__dirname, '../.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            const match = content.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.+)/);
            if (match) {
                key = match[1].trim();
            }
        }
    } catch (e) {
        console.log("Could not read .env.local");
    }

    // Fallback to the one provided in chat if file read fails
    if (!key) key = "AIzaSyAjYi_KiCuvplqwQZy8NhgfWNpl_cCrS94";

    if (!key) {
        console.error("No API Key found");
        return;
    }

    console.log("Using key ending in...", key.slice(-4));
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("Error listing models:", JSON.stringify(data.error, null, 2));
        } else {
            console.log("Available Models:");
            if (data.models) {
                data.models.forEach(m => {
                    // Check if it supports generateContent
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                        console.log(`- ${m.name}`);
                    }
                });
            } else {
                console.log("No models returned.");
            }
        }
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

listModels();

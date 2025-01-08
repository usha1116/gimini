import { GoogleGenerativeAI , HarmCategory , HarmBlockThreshold } from "@google/generative-ai";
// const prompt = "Explain how AI works";

const API_KEY = import.meta.env.VITE_API_KEY
async function runChat(prompt) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

    const generationConfig = {
        temperature :0.9,
        topK :1,
        topP:1,
        maxOutputTokens:2048
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_INFLAMMATORY,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_AGgression,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_INSULT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_OFFensive_LANGUAGE,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        }
    ]

    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history:[]
    })

    const result = await model.generateContent(prompt);
    // const result = await chat.sendMessage(prompt)
    const response = result.response
    console.log(response.text());
    return response.text();
}

export default runChat; 
const API_KEY = import.meta.env.VITE_API_KEY;

// Function to get available models
async function getAvailableModels() {
    try {
        // Try v1beta first
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );
        
        if (!response.ok) {
            // Try v1 if v1beta fails
            const responseV1 = await fetch(
                `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
            );
            if (!responseV1.ok) {
                return [];
            }
            const data = await responseV1.json();
            if (data.models) {
                return data.models
                    .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
                    .map(model => model.name.replace('models/', ''));
            }
            return [];
        }
        
        const data = await response.json();
        if (data.models) {
            return data.models
                .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
                .map(model => model.name.replace('models/', ''));
        }
        return [];
    } catch (error) {
        console.error('Error fetching available models:', error);
        return [];
    }
}

async function runChat(prompt) {
    try {
        // Check if API key is provided
        if (!API_KEY) {
            throw new Error("API key is missing. Please set VITE_API_KEY in your .env file");
        }

        // First, get available models
        console.log('Fetching available models...');
        const availableModels = await getAvailableModels();
        console.log('Available models:', availableModels);

        // Use available models if found, otherwise use default list
        const modelsToTry = availableModels.length > 0 
            ? availableModels 
            : ["gemini-pro", "gemini-1.5-pro", "gemini-1.5-flash"];

        // Try different API versions
        const apiVersions = ['v1beta', 'v1'];

        // Try each model with each API version
        for (const modelName of modelsToTry) {
            for (const apiVersion of apiVersions) {
                try {
                    console.log(`Trying model: ${modelName} with API version: ${apiVersion}`);
                    
                    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${API_KEY}`;
                    
                    const requestBody = {
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.9,
                            topK: 1,
                            topP: 1,
                            maxOutputTokens: 2048
                        }
                    };

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody)
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
                    }

                    const data = await response.json();
                    
                    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                        const text = data.candidates[0].content.parts[0].text;
                        console.log(`✓ Successfully used model: ${modelName} with API version: ${apiVersion}`);
                        return text;
                    } else {
                        throw new Error('No response text in API response');
                    }
                } catch (error) {
                    console.log(`✗ Model ${modelName} with ${apiVersion} failed:`, error.message);
                    // Continue to next API version or model
                    continue;
                }
            }
        }

        // If all attempts failed
        throw new Error(
            "All models failed. Available models found: " + (availableModels.length > 0 ? availableModels.join(', ') : 'none') + 
            ". Please enable Generative Language API at: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com"
        );
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}

export default runChat; 
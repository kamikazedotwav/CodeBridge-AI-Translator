require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize the API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/translate', async (req, res) => {
    const { sourceCode, fromLang, toLang } = req.body;

    if (!sourceCode) {
        return res.status(400).json({ error: "Please provide code." });
    }

    try {
        // We are using 'gemini-1.5-flash' but calling it directly 
        // without the 'v1beta' prefix which was causing your 404.
        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
        
        let prompt = `Translate this ${fromLang} code to ${toLang}. 
        Return ONLY the raw code. No markdown, no backticks, no explanations.`;

        if (toLang === 'C++') {
            prompt += `\nPlease include 'using namespace std;' at the top of the C++ code to make it easier to read.`;
        }

        prompt += `\n\nCode:\n        ${sourceCode}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.json({ translatedCode: text.trim() });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server ready on http://localhost:${PORT}`);
});
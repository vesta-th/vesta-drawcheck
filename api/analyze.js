// This file acts as a secure bridge between your web and Google AI
export default async function handler(req, res) {
    // Access the hidden key from Vercel's Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Logic Audit: If the key is not defined in Vercel, the AI cannot function.
    // This check helps prevent generic 500 errors by identifying the root cause.
    if (!apiKey || apiKey === "") {
        return res.status(500).json({ 
            error: "API Key Missing: Please ensure 'GEMINI_API_KEY' is added to your Vercel Project Settings under Environment Variables." 
        });
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // We use the proxy to keep the apiKey strictly on the server side
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        // Handle specific errors returned by the Google API (e.g., Invalid Key or Quota exceeded)
        if (data.error) {
            return res.status(response.status || 400).json({ 
                error: `Google AI Error: ${data.error.message}` 
            });
        }

        res.status(200).json(data);
    } catch (error) {
        // Fallback for unexpected network connectivity issues
        res.status(500).json({ error: 'Failed to communicate with the VESTA AI Engine.' });
    }
}

// VESTA DrawCheck Secure Bridge (Production v2.0 - Gemini 3.1)
export default async function handler(req, res) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Check if the API key is present in Vercel settings
    if (!apiKey || apiKey === "") {
        return res.status(500).json({ 
            error: "API Key Missing: Ensure 'GEMINI_API_KEY' is added to Vercel Environment Variables." 
        });
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // UPDATED: Using the model you found in AI Studio for 2026 compatibility
        const model = "gemini-3.1-pro-preview";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        // Specific handling for Google API errors
        if (data.error) {
            return res.status(response.status || 400).json({ 
                error: `Google AI Engine Error: ${data.error.message}` 
            });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Critical failure connecting to the VESTA AI infrastructure.' });
    }
}

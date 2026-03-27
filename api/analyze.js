// VESTA DrawCheck Secure Bridge (Stabilized v1.1)
export default async function handler(req, res) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === "") {
        return res.status(500).json({ 
            error: "API Key Missing: Please ensure 'GEMINI_API_KEY' is added to your Vercel Project Settings." 
        });
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // USING v1beta FOR BETTER COMPATIBILITY WITH STRUCTURED JSON MimeType
        const model = "gemini-1.5-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (data.error) {
            return res.status(response.status || 400).json({ 
                error: `Google AI Error: ${data.error.message}` 
            });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to communicate with VESTA AI Engine.' });
    }
}

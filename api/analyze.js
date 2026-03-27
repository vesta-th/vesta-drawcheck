// VESTA DrawCheck Secure Bridge (2026 Free Tier Optimized - v1.3)
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
        /**
         * LOGIC AUDIT: 
         * Model: gemini-2.5-flash (Current 2026 Standard)
         * Endpoint: v1beta (Required for responseMimeType support)
         * Tier: Free (No billing required for Flash models)
         */
        const model = "gemini-2.5-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        // Handle the 429 Quota error specifically for VESTA's free-tier users
        if (response.status === 429) {
            return res.status(429).json({ 
                error: "VESTA Engine Quota Reached. The 2.5-Flash free tier allows ~15 audits/min. Please wait 60 seconds before the next page." 
            });
        }

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

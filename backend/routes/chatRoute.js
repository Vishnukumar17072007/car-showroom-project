const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    const { messages, system } = req.body;

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.1-8b-instant',
                max_tokens: 1000,
                messages: [
                    { role: 'system', content: system },
                    ...messages,
                ],
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        res.json({
            content: [{ text: response.data.choices[0].message.content }]
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
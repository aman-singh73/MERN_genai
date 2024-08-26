import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

router.post('/', async (req, res) => {
  try {
    const response = await openai.images.generate({
      prompt: req.body.prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageData = response.data[0]?.url;
    if (!imageData) {
      throw new Error('Image URL not found in the response');
    }

    res.json({ photo: imageData });
  } catch (error) {
    console.error('Error generating image:', error.message);
    if (error.message.includes('Billing hard limit')) {
      res.status(402).send({ error: 'Payment required: Billing limit has been reached.' });
    } else {
      res.status(500).send({ error: 'Internal Server Error: ' + error.message });
    }
  }
});

export default router;

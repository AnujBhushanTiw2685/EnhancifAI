const axios = require('axios');
const FormData = require('form-data');

module.exports = async function handler(req, res) {
  // 1. Enable Logs to see what happens in Vercel Dashboard
  console.log("Backend hit. Method:", req.method);

  if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageBase64 } = req.body;

    // 2. Check if frontend actually sent data
    if (!imageBase64) {
        console.error("Error: No imageBase64 received in body");
        return res.status(400).json({ error: 'No image data received from frontend' });
    }

    console.log("Image received. Length:", imageBase64.length);

    // 3. Robust Base64 parsing (Fixes "split" errors)
    // Sometimes the string has "data:image/png;base64," prefix, sometimes not.
    const base64Data = imageBase64.includes('base64,') 
        ? imageBase64.split('base64,')[1] 
        : imageBase64;

    const buffer = Buffer.from(base64Data, 'base64');
    
    // 4. Create FormData for PicWish
    const formData = new FormData();
    formData.append('image_file', buffer, { filename: 'upload.png', contentType: 'image/png' });

    const API_KEY = process.env.PICWISH_API_KEY;
    if (!API_KEY) {
        console.error("Error: PICWISH_API_KEY is missing in Vercel Settings");
        return res.status(500).json({ error: 'Server configuration error' });
    }

    console.log("Sending to PicWish...");

    // 5. Send to PicWish with increased limits
    const response = await axios.post('https://techhk.aoscdn.com/api/tasks/visual/scale', formData, {
      headers: {
        'X-API-KEY': API_KEY,
        ...formData.getHeaders(),
      },
      maxBodyLength: Infinity, // Prevent Axios from cutting off large images
      maxContentLength: Infinity
    });

    console.log("PicWish Success:", response.data);
    res.status(200).json(response.data);

  } catch (error) {
    // Log the EXACT error from PicWish or Axios
    console.error("Backend Error:", error.response?.data || error.message);
    
    res.status(500).json({ 
        error: error.message, 
        details: error.response?.data || "Check Vercel Logs"
    });
  }
};
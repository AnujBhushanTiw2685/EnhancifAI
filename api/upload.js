// api/upload.js
import axios from 'axios';
import FormData from 'form-data';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { imageBase64 } = req.body;
  const API_KEY = process.env.PICWISH_API_KEY; // Only exists on server

  try {
    // Convert Base64 back to a Buffer for the API
    const buffer = Buffer.from(imageBase64.split(',')[1], 'base64');
    
    const formData = new FormData();
    formData.append('image_file', buffer, { filename: 'image.png' });

    const response = await axios.post('https://techhk.aoscdn.com/api/tasks/visual/scale', formData, {
      headers: {
        'X-API-KEY': API_KEY,
        ...formData.getHeaders(),
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
const axios = require('axios');

module.exports = async function handler(req, res) {
  const { taskId } = req.query;
  const API_KEY = process.env.PICWISH_API_KEY;

  if (!taskId) return res.status(400).json({ error: 'Task ID missing' });

  try {
    const response = await axios.get(`https://techhk.aoscdn.com/api/tasks/visual/scale/${taskId}`, {
      headers: { 'X-API-KEY': API_KEY },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
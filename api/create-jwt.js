import jwt from 'jsonwebtoken';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const clientEmail = process.env.GCP_CLIENT_EMAIL;
    const privateKey = process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
      return res.status(500).json({ error: 'Missing credentials' });
    }

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    };

    const jwtToken = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtToken,
      },
    });

    return res.status(200).json({ access_token: tokenResponse.data.access_token });
  } catch (error) {
    console.error(error.response?.data || error.message || error);
    return res.status(500).json({ error: 'Token generation failed' });
  }
}

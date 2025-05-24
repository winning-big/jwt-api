import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { email, uid } = req.body;

  const secret = process.env.JWT_SECRET || 'dnlsldqlr1!';
  const payload = {
    email,
    uid,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 5
  };

  try {
    const token = jwt.sign(payload, secret, { algorithm: 'HS256' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'JWT 생성 실패', detail: error.message });
  }
}

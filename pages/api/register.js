import { createUser } from '../../src/lib/db';

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, name } = req.body;
    try {
      const userId = await createUser(email, password, name);
      res.status(200).json({ success: true, userId });
    } catch (e) {
      const errorMsg = e && typeof e === 'object' && 'message' in e ? e.message : String(e);
      res.status(400).json({ success: false, error: errorMsg });
    }
  } else {
    res.status(405).end();
  }
} 
// pages/api/avatar.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { put } from '@vercel/blob';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const config = {
  api: {
    bodyParser: false, // penting untuk pakai formidable
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  const user = verifyToken(token || '');

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const form = formidable({ uploadDir: '/tmp', keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Formidable error:', err);
      return res.status(500).json({ error: 'Failed to parse form' });
    }

    const file = files.file?.[0];
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const stream = fs.createReadStream(file.filepath);
      const blob = await put(file.originalFilename || 'upload.jpg', stream, {
        access: 'public',
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { avatar: blob.url },
      });

      return res.status(200).json({ msg: 'Success update avatar', url: blob.url });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Failed to upload file' });
    }
  });
}

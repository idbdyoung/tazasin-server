import express from 'express';
import CRYPTO from 'crypto';
import JWT from 'jsonwebtoken';

import client from '../lib/client';

interface EnterRequestBody {
  name: string;
  password: string;
}

interface EnterResponseBody {
  ok: boolean;
  token?: string;
  error?: string;
}

const router = express.Router();

router.post<{}, EnterResponseBody, EnterRequestBody>('/', async (req, res) => {
  const { name, password } = req.body;

  const user = await client.user.findUnique({
    where: {
      name,
    },
  });

  if (!user) {
    return res.status(200).json({
      ok: false,
      error: '회원가입 되지 않은 유저입니다.',
    });
  }

  if (
    user.password !== CRYPTO.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex')
  ) {
    return res.status(200).json({
      ok: false,
      error: '로그인 정보가 올바르지 않습니다.',
    });
  }
  const token = JWT.sign({ name: user.name }, process.env.TOKEN_SECRET, { expiresIn: '30d' });

  return res.status(200).json({
    ok: true,
    token,
  });
});

export default router;

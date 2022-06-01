import express from 'express';
import CRYPTO from 'crypto';
import JWT from 'jsonwebtoken';

import client from '../lib/client';
import endpoint from '../endpoint';

interface SignupRequestBody {
  name: string;
  password: string;
}

interface SignupResponseBody {
  ok: boolean;
  token?: string;
  error?: string;
}

const IdBlackList = ['타자의신', '관리자'];
const router = express.Router();

router.post<{}, SignupResponseBody, SignupRequestBody>('/', async (req, res) => {
  const { name, password } = req.body;

  if (IdBlackList.find(listName => listName === name)) {
    return res.status(200).json({
      ok: false,
      error: '등록할 수 없는 이름입니다.',
    });
  }

  const isUserExist = await client.user.findUnique({
    where: {
      name,
    },
  });

  if (isUserExist) {
    return res.status(200).json({
      ok: false,
      error: '이미 존재하는 이름입니다.',
    });
  }
  const salt = CRYPTO.randomBytes(16).toString('hex');
  const hashedPassword = CRYPTO.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  const user = await client.user.create({
    data: {
      name,
      salt,
      password: hashedPassword,
    },
  });
  const token = JWT.sign({ name: user.name }, endpoint.TOKEN_SECRET!, { expiresIn: '30d' });

  return res.status(200).json({
    ok: true,
    token,
  });
});

export default router;

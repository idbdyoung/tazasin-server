import { verify } from 'jsonwebtoken';

interface TokenPayload {
  name: string;
}

export default function (token: string): Promise<TokenPayload> {
  return new Promise((resolve, reject) => {
    verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded as TokenPayload);
    });
  });
}

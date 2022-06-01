import { verify } from 'jsonwebtoken';
import endpoint from '../../endpoint';

interface TokenPayload {
  name: string;
}

export default function (token: string): Promise<TokenPayload> {
  return new Promise((resolve, reject) => {
    verify(token, endpoint.TOKEN_SECRET!, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded as TokenPayload);
    });
  });
}

import { RequestHandler } from 'express';
import parseBearerToken from 'parse-bearer-token';

import validateToken from '../validation/validateToken';
import client from '../client';

const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const token = parseBearerToken(req);

    if (!token) throw new Error();
    const { name } = await validateToken(token);
    const user = await client.user.findUnique({
      where: {
        name,
      },
      select: {
        id: true,
        name: true,
        totalGame: true,
        winGame: true,
        level: true,
        experience: true,
      },
    });

    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).end();
  }
};

export default authenticate;

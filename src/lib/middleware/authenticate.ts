import { RequestHandler } from 'express';

import validateToken from '../validation/validateToken';
import client from '../client';

const authenticate: RequestHandler = async (req, res, next) => {
  if (!req.cookies[process.env.TOKEN_NAME]) return next();

  try {
    const { name } = await validateToken(req.cookies[process.env.TOKEN_NAME]);
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

import { Server } from 'http';
import WebSocket from 'ws';
import cookie from 'cookie';
import parseBearerToken from 'parse-bearer-token';

import Session from './Session';
import gameHelper from './redis/gameHelper';
import checkUrlExist, { CheckedIncomingMessage } from '../middleware/checkUrlExist';
import validateToken from '../validation/validateToken';
import client from '../client';
import type { User } from '@prisma/client';

interface SessionData {
  user: User;
  color: string;
}

export default function (server: Server) {
  const wss = new WebSocket.Server({ noServer: true });

  wss.on(
    'connection',
    async (socket: WebSocket, { gameId }: CheckedIncomingMessage, { user, color }: SessionData) => {
      const { accessible, reason } = gameHelper.checkGameAccessible(gameId);

      if (!accessible) return socket.close(1007, reason);
      const session = new Session(socket, gameId, user, color);
      await session.enter();

      socket.on('message', message => {
        const actionData = JSON.parse(message.toString());
        session.handleMessage(actionData);
      });
      socket.on('close', () => {
        session.leave();
      });
    }
  );

  server.on(
    'upgrade',
    checkUrlExist(async (req, socket, head) => {
      try {
        console.log(req);
        const token = parseBearerToken(req);
        console.log(token, '@@@@');
        if (!token) return;
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
        const color = gameHelper.getColor(req.gameId);

        wss.handleUpgrade(req, socket, head, ws => {
          wss.emit('connection', ws, req, { user, color });
        });
      } catch (error) {
        console.log(error);
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }
    })
  );
}

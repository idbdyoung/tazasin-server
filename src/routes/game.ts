import express from 'express';
import type { GameRoom, GameSetting } from '../@types/express';

import authenticate from '../lib/middleware/authenticate';
import gameHelper from '../lib/websocket/redis/gameHelper';

interface CreateGameRequestBody {
  createGameData: GameSetting;
}

interface CreateGameResponseBody {
  ok: boolean;
  gameId?: string;
}

interface GameListResponseBody {
  gameRoomList: GameRoom[];
}

const router = express.Router();

router.get<{}, GameListResponseBody>('/list', authenticate, async (req, res) => {
  const gameRoomList = gameHelper.getAllGames();
  // .filter(game => game.gameState === 'waiting' && !game.isPrivate);
  res.status(200).json({ gameRoomList });
});

router.post<{}, CreateGameResponseBody, CreateGameRequestBody>(
  '/create',
  authenticate,
  async (req, res) => {
    const { createGameData } = req.body;

    const gameId = await gameHelper.createGame({
      ...createGameData,
      hostId: req.user.id!,
    });

    if (gameId) {
      res.status(200).json({ ok: true, gameId });
    } else {
      res.status(200).json({ ok: false });
    }
  }
);

export default router;

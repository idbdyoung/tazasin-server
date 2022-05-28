import { User } from '@prisma/client';
import * as express from 'express';
import Session from '../../lib/websocket/Session';

type ColorMap = {
  [key in string]: boolean;
};

type GameRoom = {
  gameId: string;
  gameState: 'ingame' | 'waiting' | 'destroy';
  roomName: string;
  isPrivate: boolean;
  hostId: number;
  colorStore: ColorMap;
  sessions: Session[];
};

type GameSetting = {
  roomName: string;
  isPrivate: boolean;
};

declare global {
  namespace Express {
    interface Request {
      user: Partial<User>;
    }
  }
}

import { GameRoom } from '../@types/express';

interface CreateGameRoomProps {
  gameId: string;
  roomName: string;
  isPrivate: boolean;
  hostId: number;
}

export const createGameItem = ({
  gameId,
  roomName,
  isPrivate,
  hostId,
}: CreateGameRoomProps): GameRoom => ({
  gameId,
  gameState: 'waiting',
  roomName,
  isPrivate,
  hostId,
  colorStore: {
    '#4F85ED': false,
    '#57A85C': false,
    '#DA4E3D': false,
    '#F2C043': false,
  },
  sessions: [],
});

export const createGameId = () => Math.floor(100000 + Math.random() * 900000).toString();

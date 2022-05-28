import type Session from '../Session';

import prefixer from './prefixer';
import { globalSubscriber, publishToChannel } from './client';
import { createGameItem, createGameId } from '../../game';

import type { GameRoom, GameSetting } from '../../../@types/express';
import actionCreator from '../actions/send';

interface ReceiveCreateGameRoomData extends GameSetting {
  hostId: number;
}

type CheckGameResult = {
  accessible: boolean;
  reason?: string;
};

class GameHelper {
  gameRoomMap = new Map<string, GameRoom>();

  async createGame(receivedData: ReceiveCreateGameRoomData): Promise<string | undefined> {
    const { roomName, isPrivate, hostId } = receivedData;
    const gameId = createGameId();
    const key = prefixer.game(gameId);

    if (this.gameRoomMap.get(key)) return;

    await (
      await globalSubscriber
    ).subscribe(key, (message, channelName) => {
      try {
        const parsed = JSON.parse(message);
        this.gameRoomMap.get(channelName)?.sessions.forEach(session => session.emit(parsed));
      } catch (error) {
        console.log(error);
      }
    });

    const createdGame = createGameItem({
      gameId,
      roomName,
      isPrivate,
      hostId,
    });
    this.gameRoomMap.set(key, createdGame);

    return gameId;
  }

  private async deleteGame(gameId: string) {
    const key = prefixer.game(gameId);
    await (await globalSubscriber).unsubscribe(key);
    this.gameRoomMap.delete(key);
  }

  checkGameAccessible(gameId: string): CheckGameResult {
    const result: CheckGameResult = { accessible: true };
    const game = this.getGame(gameId);

    if (!game) {
      result.accessible = false;
      result.reason = '존재하지 않는 게임입니다.';
    } else if (game.gameState === 'destroy') {
      result.accessible = false;
    } else if (game.gameState === 'ingame') {
      result.accessible = false;
      result.reason = '입장할 수 업는 게임입니다.';
    } else if (game.sessions.length === 4) {
      result.accessible = false;
      result.reason = '제한 인원이 꽉찼습니다.';
    }
    return result;
  }

  getGame(gameId: string) {
    const key = prefixer.game(gameId);
    return this.gameRoomMap.get(key);
  }

  getAllGames(): GameRoom[] {
    return Array.from(this.gameRoomMap.values());
  }

  startGame(gameId: string) {
    const game = this.getGame(gameId);
    if (!game) return;
    game.gameState = 'ingame';
  }

  addSessionToGameMemory(session: Session) {
    const game = this.getGame(session.gameId);
    if (!game) return;
    game.sessions.push(session);

    return () => {
      if (game.sessions.length === 1) return this.deleteGame(session.gameId);
      game.sessions = game.sessions.filter(s => s.id !== session.id);

      if (game.hostId === +session.id) {
        game.hostId = +game.sessions[0].id;
        publishToChannel(
          prefixer.game(game.gameId),
          actionCreator.leaved(session.id, game.sessions[0].id)
        );
      } else {
        publishToChannel(prefixer.game(game.gameId), actionCreator.leaved(session.id));
      }
    };
  }

  getColor(gameId: string) {
    const game = this.getGame(gameId);
    if (!game) return;
    const colorName = Object.entries(game.colorStore).find(state => !state[1])?.[0];
    if (!colorName) return;
    game.colorStore[colorName] = true;
    return colorName;
  }

  returnColor(gameId: string, colorName: string) {
    const game = this.getGame(gameId);
    if (!game) return;
    game.colorStore[colorName] = false;
  }
}
const gameHelper = new GameHelper();

export default gameHelper;

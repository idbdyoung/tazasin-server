import { WebSocket } from 'ws';

import { ReceiveAction } from './actions/receive';
import actionCreator, { SendAction } from './actions/send';
import { publishToChannel } from './redis/client';
import prefixer from './redis/prefixer';
import gameHelper from './redis/gameHelper';
import directHelper from './redis/directHelper';

import type { User } from '@prisma/client';

class Session {
  id: string;
  socket: WebSocket;
  user: User;
  gameId: string;
  color: string;
  leaveWorks = new Set<(() => void) | undefined>();

  constructor(socket: WebSocket, gameId: string, user: User, color: string) {
    this.id = `${user.id}`;
    this.socket = socket;
    this.gameId = gameId;
    this.user = user;
    this.color = color;
  }

  async enter() {
    const game = gameHelper.getGame(this.gameId);

    if (!game) return this.socket.close();
    this.leaveWorks
      .add(() => gameHelper.returnColor(this.gameId, this.color))
      .add(gameHelper.addSessionToGameMemory(this))
      .add(await directHelper.createDirect(this));

    publishToChannel(
      prefixer.game(this.gameId),
      actionCreator.entered(game, this.id, this.user, this.color)
    );
  }

  leave() {
    for (const work of this.leaveWorks.values()) {
      work?.();
    }
  }

  emit(data: SendAction) {
    this.socket.send(JSON.stringify(data));
  }

  handleMessage(action: ReceiveAction) {
    switch (action.type) {
      case 'call': {
        this.handleCall(action.to, action.description, action.color, action.isUserReady);
        break;
      }
      case 'answer': {
        this.handleAnswer(action.to, action.description);
        break;
      }
      case 'candidate': {
        this.handleCandidate(action.to, action.candidate);
        break;
      }
      case 'startGame': {
        this.handleStartGame(action.gameId);
        break;
      }
      case 'endGame': {
        this.handleEndGame(action.gameId);
      }
      default:
        break;
    }
  }

  private handleCall(
    to: string,
    description: RTCSessionDescriptionInit,
    color: string,
    isUserReady: boolean
  ) {
    publishToChannel(
      prefixer.direct(to),
      actionCreator.called(this.id, this.user, description, color, isUserReady)
    );
  }

  private handleAnswer(to: string, description: RTCSessionDescriptionInit) {
    publishToChannel(prefixer.direct(to), actionCreator.answered(this.id, description));
  }

  private handleCandidate(to: string, candidate: RTCIceCandidateInit | null) {
    publishToChannel(prefixer.direct(to), actionCreator.candidated(this.id, candidate));
  }

  private handleStartGame(gameId: string) {
    gameHelper.startGame(gameId);
    publishToChannel(prefixer.game(this.gameId), actionCreator.gameStarted());
  }

  private handleEndGame(gameId: string) {
    gameHelper.deleteGame(gameId);
    console.log(gameHelper.gameRoomMap);
  }
}

export default Session;

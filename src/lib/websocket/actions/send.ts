// // import { GameInfo } from '../../../@types/express';

import type { User } from '@prisma/client';
import type { GameRoom } from '../../../@types/express';

type EnteredAction = {
  type: 'entered';
  gameRoom: GameRoom;
  sessionId: string;
  user: User;
  color: string;
};

type LeavedAction = {
  type: 'leaved';
  leavedId: string;
  nextHostId?: string;
};

type CalledAction = {
  type: 'called';
  from: string;
  user: User;
  description: RTCSessionDescriptionInit;
  color: string;
  isUserReady: boolean;
};

type AnsweredAction = {
  type: 'answered';
  from: string;
  description: RTCSessionDescriptionInit;
};

type CandidatedAction = {
  type: 'candidated';
  from: string;
  candidate: RTCIceCandidateInit | null;
};

type GameStartedAction = {
  type: 'gameStarted';
};

export type SendAction =
  | EnteredAction
  | LeavedAction
  | CalledAction
  | AnsweredAction
  | CandidatedAction
  | GameStartedAction;

const actionCreator = {
  entered: (gameRoom: GameRoom, sessionId: string, user: User, color: string): EnteredAction => ({
    type: 'entered',
    gameRoom,
    sessionId,
    user,
    color,
  }),
  leaved: (id: string, nextHostId?: string): LeavedAction => ({
    type: 'leaved',
    leavedId: id,
    nextHostId,
  }),
  called: (
    from: string,
    user: User,
    description: RTCSessionDescriptionInit,
    color: string,
    isUserReady: boolean
  ): CalledAction => ({
    type: 'called',
    from,
    user,
    description,
    color,
    isUserReady,
  }),
  answered: (from: string, description: RTCSessionDescriptionInit): AnsweredAction => ({
    type: 'answered',
    from,
    description,
  }),
  candidated: (from: string, candidate: RTCIceCandidateInit | null): CandidatedAction => ({
    type: 'candidated',
    from,
    candidate,
  }),
  gameStarted: (): GameStartedAction => ({
    type: 'gameStarted',
  }),
};

export default actionCreator;

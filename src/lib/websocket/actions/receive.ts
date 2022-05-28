type CallAction = {
  type: 'call';
  to: string;
  description: RTCSessionDescriptionInit;
  color: string;
  isUserReady: boolean;
};

type AnswerAction = {
  type: 'answer';
  to: string;
  description: RTCSessionDescriptionInit;
};

type CandidateAction = {
  type: 'candidate';
  to: string;
  candidate: RTCIceCandidateInit | null;
};

type StartGameAction = {
  type: 'startGame';
  gameId: string;
};

export type ReceiveAction = CallAction | AnswerAction | CandidateAction | StartGameAction;

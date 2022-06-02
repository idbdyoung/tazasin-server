import { IncomingMessage } from 'http';
import internal from 'stream';

export interface CheckedIncomingMessage extends IncomingMessage {
  gameId: string;
  token: string;
}

interface NewSocketServerListener {
  (req: CheckedIncomingMessage, socket: internal.Duplex, head: Buffer): void;
}

const checkUrlExist =
  (listener: NewSocketServerListener) =>
  (req: IncomingMessage, socket: internal.Duplex, head: Buffer) => {
    const url = req.url?.substring(1);
    if (!url) return socket.destroy();
    const splitted = url.split('?token=');
    const newReq: CheckedIncomingMessage = Object.assign(req, {
      gameId: splitted[0],
      token: splitted[1],
    });
    listener(newReq, socket, head);
  };

export default checkUrlExist;

import { Socket } from 'socket.io';
import { JwtPayload } from '@app/contracts';

export interface AuthenticatedSocket extends Socket {
  data: {
    user: JwtPayload;
  };
}

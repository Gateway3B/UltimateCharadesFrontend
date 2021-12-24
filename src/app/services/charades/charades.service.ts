import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SocketService } from '../socket/socket.service';
import { session } from './objects/session';
import { receiveEvents } from './events/receiveEvents';
import { emitEvents } from './events/emitEvents';
import { sessionEvents } from './events/sessionEvents';

@Injectable({
  providedIn: 'root'
})
export class CharadesService {

  sessionSubject: Subject<sessionEvents>;
  emitEvents: emitEvents;
  session: session;
  
  private receiveEvents: receiveEvents;

  constructor(private socketService: SocketService) {
    this.session = session.CreateEmpty();
    this.sessionSubject = new Subject();

    this.receiveEvents = new receiveEvents(this.session, this.sessionSubject);
    this.emitEvents = new emitEvents(this.session, this.socketService);

    this.socketService.socketId.subscribe(socketId => {
      this.session.userId = socketId;
    });

    Object.getOwnPropertyNames(receiveEvents.prototype).filter(method => method !== 'constructor').forEach(event => {
      this.socketService.listenToServer(event).subscribe(data => {
        this.receiveEvents[event](data);
      });
    });
  }
}

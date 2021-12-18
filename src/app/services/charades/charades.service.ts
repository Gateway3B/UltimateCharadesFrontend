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

  public sessionSubject: Subject<sessionEvents>;
  public emitEvents: emitEvents;
  
  session: session;
  receiveEvents: receiveEvents;

  constructor(private socketService: SocketService) {
    this.session = session.CreateEmpty();
    this.sessionSubject = new Subject();

    this.receiveEvents = new receiveEvents(this.session, this.sessionSubject);
    this.emitEvents = new emitEvents(this.session, socketService);

    Object.keys(this.receiveEvents.events).forEach(key => {
      this.socketService.listenToServer(key).subscribe(data => {
        this.session.userId = this.socketService.socketId; // TODO: This is wastefull and needs to be moved into an observable.
        this.receiveEvents.events[key](data);
      });
    });
  }
}

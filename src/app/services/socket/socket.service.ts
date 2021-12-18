import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketIOClient, connect, Connection } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private clientSocket: SocketIOClient.Socket;
  public socketId: string;

  constructor() {
    this.clientSocket = connect(environment.TEST_URL);    
    this.clientSocket.on('connect', () => {
      this.socketId = this.clientSocket.id;
    });
  }

  listenToServer(connection: Connection): Observable<any> {
    return new Observable(subscribe => {
      this.clientSocket.on(connection, data => {
        console.log({Received: connection, Message: data});
        subscribe.next(data);
      });
    });
  }

  emitToServer(connection: Connection, data: string): void {
    console.log({Emitted: connection, Message: data});
    this.clientSocket.emit(connection, data);
  }
  
}

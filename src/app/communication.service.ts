import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private socket: WebSocket | null = null;  // Initialisé à null
  private messagesSubject = new Subject<string>();
  public messages$ = this.messagesSubject.asObservable();

  private roomName: string ="jj";

  constructor() {}

  public connect(user1: string, user2: string): void {
    this.roomName = this.getRoomName(user1, user2);
    const url = `ws://127.0.0.1:8001/ws/chat/${this.roomName}/`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event: MessageEvent) => {
      let message: any;
      try {
        message = JSON.parse(event.data);
      } catch (error) {
        console.error('Erreur lors de l\'analyse du message JSON:', error, event.data);
        return;
      }
      this.messagesSubject.next(message);
    };
    //  this.socket.onclose = () => {
    //    console.log('WebSocket connection closed');
    //  };

    this.socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };
  }

  private getRoomName(user1: string, user2: string): string {
    // Always order users to ensure the room name is consistent
    if (user1 < user2) {
      return `${user1}_${user2}`;
    }
    return `${user2}_${user1}`;
  }

  public sendMessage(message: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn('WebSocket is not open');
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}

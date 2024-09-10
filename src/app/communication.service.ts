import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private socket: WebSocket | null = null;
  private messagesSubject = new Subject<{ sender: string, receiver: string, message: string }>();
  public messages$ = this.messagesSubject.asObservable();

  private roomName: string = "";

  constructor() {}

  public connect(user1: string, user2: string): void {
    this.roomName = this.getRoomName(user1, user2);
    const url = `ws://127.0.0.1:8001/ws/chat/${this.roomName}/`;
    this.socket = new WebSocket(url);
  
    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      console.log(`WebSocket connecté pour ${user1} avec ${user2}`);
    };
  
    this.socket.onmessage = (event: MessageEvent) => {
      console.log('Message reçu:', event.data); // Log le message brut
      let message: { sender: string, receiver: string, message: string };
      try {
        message = JSON.parse(event.data);
        if (message.sender && message.receiver && message.message) {
          this.messagesSubject.next(message);
          console.log("Message analysé et émis:", message);
        } else {
          console.warn('Message reçu mal formaté:', message);
        }
      } catch (error) {
        console.error('Erreur lors de l\'analyse du message JSON:', error, event.data);
      }
    };
  
    this.socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };
  
    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }
  
  private getRoomName(user1: string, user2: string): string {
    if (user1 < user2) {
      return `${user1}_${user2}`;
    }
    return `${user2}_${user1}`;
  }

  public sendMessage(sender: string, receiver: string, message: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const messageData = JSON.stringify({
        sender: sender,
        receiver: receiver,
        message: message,
      });
      console.log("Message envoyé:", messageData);
      this.socket.send(messageData);
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

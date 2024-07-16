import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private commentsSubject = new BehaviorSubject<any[]>([]);
  comments$ = this.commentsSubject.asObservable();
  
  constructor() { }

  
  setMessages(messages: any[]) {
    this.messagesSubject.next(messages);
  }

  setComments(comments: any[]) {
    this.commentsSubject.next(comments);
  }

  addMessage(message: any) {
    const messages = this.messagesSubject.getValue();
    this.messagesSubject.next([...messages, message]);
  }

  addComment(comment: any) {
    const comments = this.commentsSubject.getValue();
    this.commentsSubject.next([...comments, comment]);
  }
}

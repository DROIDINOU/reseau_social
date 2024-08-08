import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunicationService } from '../communication.service'; // Assurez-vous que le chemin est correct
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-privatechat',
  templateUrl: './privatechat.component.html',
  styleUrls: ['./privatechat.component.scss']
})
export class PrivatechatComponent implements OnInit, OnDestroy {
  public messages: any[] = [];
  public messageText: string = '';
  private user1: string = 'marc';  // Remplacez par l'utilisateur courant
  private user2: string = '1';  // Remplacez par l'utilisateur avec qui vous discutez
  private chatSubscription: Subscription | null = null;

  constructor(private chatService: CommunicationService) {}

  ngOnInit(): void {
    this.chatService.connect(this.user1, this.user2);

    // Abonnez-vous aux messages du service
    this.chatSubscription = this.chatService.messages$.subscribe((message: string) => {
      const parsedMessage = JSON.parse(message);
      console.log('Message reçu:', parsedMessage); // Vérifiez la structure des messages reçus
      this.messages.push(parsedMessage);
    });
  }

  ngOnDestroy(): void {
    // Nettoyez la connexion WebSocket lorsque le composant est détruit
    this.chatService.disconnect();
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }

  public sendMessage(): void {
    if (this.messageText.trim()) {
      this.chatService.sendMessage(this.messageText);
      this.messageText = '';  // Réinitialiser le champ de message après envoi
    }
  }
}

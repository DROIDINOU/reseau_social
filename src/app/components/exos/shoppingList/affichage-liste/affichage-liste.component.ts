import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-affichage-liste',
  templateUrl: './affichage-liste.component.html',
  styleUrl: './affichage-liste.component.scss'
})
export class AffichageListeComponent {
    @Input() articlesEnfant : {id : number, nom : string}[] = []
    @Output() SupprimerArticleEvent : EventEmitter<number> = new EventEmitter<number>()

    supprimerArticleEnfant( id : number){
        this.SupprimerArticleEvent.emit(id)
    }
}

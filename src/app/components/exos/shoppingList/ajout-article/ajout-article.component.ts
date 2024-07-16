import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ajout-article',
  templateUrl: './ajout-article.component.html',
  styleUrl: './ajout-article.component.scss'
})
export class AjoutArticleComponent {
    nouvelArticle : string = ""

    @Output() ajoutArticleEvent : EventEmitter<string> = new EventEmitter<string>()

    ajouterArticleEnfant(){
        if(this.nouvelArticle.trim()){
            this.ajoutArticleEvent.emit(this.nouvelArticle.trim())
            this.nouvelArticle = ''
        }
    }
}

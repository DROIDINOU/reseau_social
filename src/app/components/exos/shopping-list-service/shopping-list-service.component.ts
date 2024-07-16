import { Component } from '@angular/core';
import { ShoppingListService } from '../../../tools/services/shopping-list.service';

@Component({
    selector: 'app-shopping-list-service',
    templateUrl: './shopping-list-service.component.html',
    styleUrl: './shopping-list-service.component.scss'
})
export class ShoppingListServiceComponent {
    articles  = this.ShoppingListeService.getArticle()
    newArticleNom = ""
    newArticleQte = 1

    constructor(private ShoppingListeService : ShoppingListService) {}

    ajoutArticle(){
        if(!this.newArticleNom){
            alert("L'article doit être encodée pour être validée ❌")
        }else if (this.newArticleQte <= 0){
            alert("La quantité doit être supérieur a zéro ❌")
        }
        else {
            this.ShoppingListeService.ajoutArticle(this.newArticleNom, this.newArticleQte)
            this.articles = this.ShoppingListeService.getArticle()
            this.newArticleNom = ""
            this.newArticleQte = 1
            alert("Article ajoutés avec succès ✔")
        }
    }

    augmenterQte(nom :string){
        const article = this.articles.find(article => article.nom === nom)
        if(article){
            this.ShoppingListeService.updateQuantite(nom, article.quantite + 1)
            this.articles = this.ShoppingListeService.getArticle()
        }
    }

    diminuerQte(nom :string){
        const article = this.articles.find(article => article.nom === nom)
        if(article){
            this.ShoppingListeService.updateQuantite(nom, article.quantite - 1)
            this.articles = this.ShoppingListeService.getArticle()
        }
    }

    supprimer(nom :string){
        this.ShoppingListeService.supprimerArticle(nom)
        this.articles = this.ShoppingListeService.getArticle()
    }
}

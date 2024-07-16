import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

    private articles : { nom : string, quantite : number}[] = []

    getArticle(){
        return this.articles
    }

    ajoutArticle(nom : string, quantite : number){
        const article = this.articles.find(article => article.nom === nom)
        if (article) {
            article.quantite += quantite
            alert(`Le produit ${{nom}} existe déjà dans la liste \nQuantité incrémentée de ${{quantite}}`)
        }
        else{
            this.articles.push({nom, quantite})
        }
    }

    updateQuantite(nom : string, quantite : number){
        console.log(quantite);
        const article = this.articles.find(article => article.nom === nom)
        if (article){
            article.quantite = quantite
            if (article.quantite <= 0) {
                this.supprimerArticle()
            }
        }
    }

    supprimerArticle(nom? : string){
        this.articles = this.articles.filter(article => article.nom !== article.nom )
    }
}

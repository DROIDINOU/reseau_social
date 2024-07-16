import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LivreService {
    private livres : any= [
        {id : 1, titre : "Le Petit Prince"},
        {id : 2, titre : "Harry Potter"},
        {id : 3, titre : "Moby Dick"}
    ]

    getLivres(){
        return this.livres
    }

    ajoutLivre(livre : {id : number, titre : string}){
        this.livres.push(livre)
    }
}

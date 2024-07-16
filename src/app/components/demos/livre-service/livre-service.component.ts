import { Component } from '@angular/core';
import { LivreService } from '../../../tools/services/livre.service';

@Component({
  selector: 'app-livre-service',
  templateUrl: './livre-service.component.html',
  styleUrl: './livre-service.component.scss'
})
export class LivreServiceComponent {
    livres : any[] = []
    newId : number = 0
    newTitre : string = ""

    constructor(private livreService : LivreService) {}

    ngOnInit(): void {
        this.livres = this.livreService.getLivres()
    }

    ajoutLivre() :void{
        if(this.newId !== 0 && this.newTitre !== ""){
            let newLivre = {id : this.newId, titre : this.newTitre}
            this.livreService.ajoutLivre(newLivre)
        }
    }
}

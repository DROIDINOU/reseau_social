import { Component } from '@angular/core';
import { LivreService } from '../../../tools/services/livre.service';

@Component({
  selector: 'app-binding',
  templateUrl: './binding.component.html',
  styleUrl: './binding.component.scss'
})
export class BindingComponent {


    nom : string = "Angular"            // Binding one-way
    valeurBiDirectionnel :string = ''   // Binding Two-way
    compteur : number = 0               // Event binding
    attributeTitre : boolean = false

    constructor(private livreService : LivreService) {}

    incrementer() : void{
        this.compteur++
    }
}

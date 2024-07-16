import { Component } from '@angular/core';

@Component({
  selector: 'app-pipe',
  templateUrl: './pipe.component.html',
  styleUrl: './pipe.component.scss'
})
export class PipeComponent {
    texte : string = "Bonjour Angular !"
    dateActuelle : Date = new Date()
    montant : number = 1234.56
    pourcentage : number = 0.5
    nombre : number = 1234567.89
    objet : any = { nom : "Angular", version : 17}
    tableau : number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}

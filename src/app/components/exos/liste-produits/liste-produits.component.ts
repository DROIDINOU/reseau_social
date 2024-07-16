import { Component } from '@angular/core';

@Component({
  selector: 'app-liste-produits',
  templateUrl: './liste-produits.component.html',
  styleUrl: './liste-produits.component.scss'
})
export class ListeProduitsComponent {
    produits = [
        { nom: 'Laptop', prix: 1200, disponible: true, categorie: 'Électronique', dateAjout: new
        Date('2023-01-15') },
        { nom: 'Chaise', prix: 150, disponible: false, categorie: 'Mobilier', dateAjout: new
        Date('2025-10-10') },
        { nom: 'Montre', prix: 300, disponible: true, categorie: 'Accessoires', dateAjout: new
        Date('2023-03-05') },
        { nom: 'Téléphone', prix: 800, disponible: true, categorie: 'Électronique', dateAjout:
        new Date('2023-02-20') },
        { nom: 'Lampe', prix: 60, disponible: false, categorie: 'Décoration', dateAjout: new
        Date('2022-12-01') },
        { nom: 'Canapé', prix: 700, disponible: true, categorie: 'Mobilier', dateAjout: new
        Date('2025-01-10') },
        { nom: 'Casque Audio', prix: 200, disponible: true, categorie: 'Électronique', dateAjout:
        new Date('2023-02-25') },
        { nom: 'Vélo', prix: 500, disponible: false, categorie: 'Sport', dateAjout: new
        Date('2022-09-15') },
        { nom: 'Table', prix: 300, disponible: true, categorie: 'Mobilier', dateAjout: new
        Date('2025-01-25') },
        { nom: 'Sac à dos', prix: 90, disponible: true, categorie: 'Accessoires', dateAjout: new
        Date('2023-03-12') },
        ];
        anneeActuelle : any = new Date().getFullYear()
}

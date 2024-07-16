import { Component } from '@angular/core';
import { RaceserviceService } from '../raceservice.service';
import { Raceinterface} from '../raceinterface';
import { ReactiveFormsModule } from '@angular/forms';
import { faStar} from '@fortawesome/free-solid-svg-icons'; // Importer l'icône d'étoile pleine

@Component({
  selector: 'app-racechat',
  templateUrl: './racechat.component.html',
  styleUrl: './racechat.component.scss'
})
export class RacechatComponent {
  constructor(private servicerace : RaceserviceService ){
    
}
  public ra : Raceinterface[]= []
  public racesDeChats : string[] = [
    'Maine Coon',
    'Persian',
    'Siamois',
    'Bengal',
    'Sphynx',
    'British Shorthair',
    'Munchkin',
    'Ragdoll',
    'Birman',
    'Scottish Fold',
    'Norvégien',
    'Sacré de Birmanie',
    'Chartreux',
    'Sibérien',
    'Abyssin',
    'Cornish Rex',
    'Manx',
    'Tonkinois',
    'Turc de Van',
    'Toyger',
    'Serengeti'
];
public hasard: string = this.racesDeChats[Math.floor(Math.random()*10)]
fastar = faStar



getallrace(){
    this.servicerace.getrace().subscribe(
      (data: Raceinterface[]) => {
        console.log(data)
        console.log("iciiiiiiiiiiiiiiiiiiiiiiii",this.ra)
        this.ra = data
        this.hasard = this.racesDeChats[Math.floor(Math.random()*10)]
        console.log(this.hasard)
      },
      error => {
        console.error('Erreur lors de la récupération des races : ', error);
      }
    );
  }}





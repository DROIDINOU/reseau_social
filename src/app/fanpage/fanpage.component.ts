import { Component, Input,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FanService } from '../fan.service';
import { Moninterface } from '../interface';
@Component({
  selector: 'app-fanpage',
  templateUrl: './fanpage.component.html',
  styleUrl: './fanpage.component.scss'
})
export class FanpageComponent implements OnInit {
  idRecupere : string = ""
  ajoutserie :string =""
  ajoutserie1 :string =""

  is_utilisateur = true;
  new : unknown
  utilisateur : Moninterface | undefined;
  constructor(private activatedRoute : ActivatedRoute,private fanservice: FanService ){
      this.idRecupere = activatedRoute.snapshot.params["nom"]
      console.log(this.idRecupere);
  }


  
ngOnInit(): void {
  if(this.fanservice.getFanbyname(this.idRecupere)){
    console.log("ici",this.idRecupere)
    this. idRecupere = ""
    console.log(this.fanservice.getFanbyname(this.idRecupere))
    this.utilisateur = this.fanservice.getFanbyname(this.idRecupere);
}
}

change(event:Event){
  if(this.fanservice.getFanbyname(this.idRecupere)){
    console.log("ici",this.idRecupere)
    console.log(this.fanservice.getFanbyname(this.idRecupere))
    this.utilisateur = this.fanservice.getFanbyname(this.idRecupere);
}}

ajouterserie(){
  if(this.fanservice.getFanbyname(this.idRecupere)){
  console.log("ici",this.idRecupere)
  this.fanservice.ajouterSeries(this.idRecupere, this.ajoutserie)
  this.utilisateur = this.fanservice.getFanbyname(this.idRecupere);
  this.ajoutserie = ''; // Réinitialisation de la propriété liée à ngModel
  this.ajoutserie1 = ''; // Réinitialisation de la propriété liée à ngModel
  console.log(this.fanservice.getid(this.idRecupere))

}
else{console.log("tu n existe pas!");
this.is_utilisateur = false;
}
}

ajouterserie1(){
  if(this.fanservice.getFanbyname(this.idRecupere)){
  console.log("ici",this.idRecupere)
  this.fanservice.deleteFavoriteSeries(this.idRecupere, this.ajoutserie1)
  this.utilisateur = this.fanservice.getFanbyname(this.idRecupere);
  this.ajoutserie1 = ''; // Réinitialisation de la propriété liée à ngModel
  this.ajoutserie = ''; // Réinitialisation de la propriété liée à ngModel


}
else{console.log("tu n existe pas!");
this.is_utilisateur = false;
}
}


}

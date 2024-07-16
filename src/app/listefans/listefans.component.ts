import { Component, OnInit } from '@angular/core';
import { FanService } from '../fan.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-listefans',
  templateUrl: './listefans.component.html',
  styleUrl: './listefans.component.scss'
})
export class ListefansComponent implements OnInit {

liste_empty : boolean = false
list_fans: { id: number; name: string; birthYear: number; favoriteSeries: string[] }[] =[]
is_disabled : boolean = false
show_videos : boolean = false
show_race : boolean = false

bgColor : string = ""
show_photos: boolean = false
user :string = ""
constructor (private router: Router, private route: ActivatedRoute){
  this.get_User()
}

ngOnInit(): void {
  
}

get_User(): void {
  // Snapshot de la route actuelle
  const snapshot: ActivatedRouteSnapshot = this.route.snapshot;

  // Supposons que nous avons un paramètre d'URL nommé 'userId'
  const user = snapshot.paramMap.get('id');
  console.log(user)

  if (user) {
    // Redirection vers une autre route en utilisant le paramètre 'userId'
    this.user = user
  }
}




videoschats():void{
  console.log("ddddddddddddddddddddddddddddddddddddd");
   this.show_videos = true;
   this.bgColor = "green"
   console.log(this.videoschats)
   this.show_photos = false; // Réinitialiser l'état des photos
   this.show_race = false; // Réinitialiser l'état des photos

}

photoschats():void{
  console.log("ddddddddddddddddddddddddddddddddddddd");
   this.show_photos = true;
   this.show_videos = false; // Réinitialiser l'état des photos
   this.show_race = false; // Réinitialiser l'état des photos

}

race():void{
  console.log("ddddddddddddddddddddddddddddddddddddd");
   this.show_race = true;
   this.show_videos = false; // Réinitialiser l'état des photos
   this.show_photos = false; // Réinitialiser l'état des photos


}


}


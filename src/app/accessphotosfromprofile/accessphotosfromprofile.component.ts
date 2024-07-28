import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { faThumbsUp,faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faEye,faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';


@Component({
  selector: 'app-accessphotosfromprofile',
  templateUrl: './accessphotosfromprofile.component.html',
  styleUrl: './accessphotosfromprofile.component.scss'
})
export class AccessphotosfromprofileComponent implements OnInit{
   constructor(private login: LoginService, private route: ActivatedRoute, private location:Location){}


fathumbsup = faThumbsUp;
faeye = faEye;
faArrowLeft = faArrowLeft;

listPhotos_forfriends$: Observable<any[]> | undefined;



ngOnInit(): void {
  const userId = this.route.snapshot.paramMap.get('id');
  console.log('User ID:', userId);
  this.listPhotos_forfriends$ = this.login.getAllPhotos();
  this.listPhotos_forfriends$.subscribe(
    photos => {
      console.log('Photos:', photos);
    },
    error => {
      console.error('Erreur lors de la récupération des photos', error);
    }
  );
}

goBack(): void {
  this.location.back();
}
  
}















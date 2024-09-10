import { Component, OnInit } from '@angular/core';
import { faUserFriends, faVideo, faComment, faImage   } from '@fortawesome/free-solid-svg-icons';
import { Router,ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-phtochat',
  templateUrl: './phtochat.component.html',
  styleUrl: './phtochat.component.scss'
})
export class PhtochatComponent implements OnInit {
 fauser = faUserFriends
 favideo = faVideo
 username:string =""
 faComment = faComment
 faImage = faImage
 currentModal100: boolean = false;
 images: string[] = [
  'https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/image-gallery/images/img-1.webp',
  'https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/image-gallery/images/img-2.webp',
  'https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/image-gallery/images/img-3.webp',
  'https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/image-gallery/images/img-5.webp',
  'https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/image-gallery/images/img-6.webp',
  'https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/image-gallery/images/img-7.webp',
  'https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/image-gallery/images/img-8.webp',
  'https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/image-gallery/images/img-9.webp',
  'https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/image-gallery/images/img-10.webp'
];
 constructor(private router: Router, private route: ActivatedRoute,private userService:UserService

 ) {}
ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const paramUsername = params.get('id');
    
    if (paramUsername) {
      this.username = paramUsername;
    } else {
      // Essayez de récupérer l'utilisateur actuel
      const userId = this.userService.getUserId();
      this.username = userId || 'defaultUsername'; // Remplacez 'defaultUsername' par une valeur par défaut appropriée
    }

    if (this.username) {
      this.userService.setUserId(this.username);
    }

    console.log('Current username:', this.username);
})}

 navigateToChat() {
  this.router.navigate(['/privatechat']);
}

navigateToPhotos(){
  this.router.navigate(['/listfan', this.username], {
    queryParams: { source: 'nextRoute' }
  });; // Navigue vers /listfan/123 si userId = 123


}

navigateToVideos() {
  // Passez un paramètre 'source' avec la valeur 'previousRoute'
  this.router.navigate(['/listfan', this.username], {
    queryParams: { source: 'previousRoute' }
  });
}


loadMoreImages(): void {
  this.images.push(...this.images);
}


 liaisonclickmodal100() {
  console.log("hellooooooooooooooooooooooooooooooo");
  this.currentModal100 = true; 

}

handleModalClosed100() {
  console.log('Modal fermé');
  this.currentModal100 = false;
}

}

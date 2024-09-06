import { Component, OnInit } from '@angular/core';
import { FakeAuthService } from '../../tools/services/fake-auth.service';
import { PointscountService } from '../../pointscount.service';
import { firstValueFrom} from 'rxjs';
import { profile } from 'console';


type Photo = {
  id: number;
  is_published: boolean;
  likes: any[];
  owner: number;
  timestamp: string;
  title: string;
  uploaded_at: string;
  username: string;
  photo: string;
};

type Video = {
  id: number;
  is_published: boolean;
  likes: any[];
  owner: number;
  timestamp: string;
  title: string;
  uploaded_at: string;
  username: string;
  video: string;
};

type Profile = {
  id: number;
  likes: any[];
  profile_picture: string;
  username: string;
};

type PodiumItem = Photo | Video | Profile;

type CombinedItem = {
  id: number;
  likes: any[];
  username: string;
};

type UserLikes = {
  username: string;
  totalLikes: any[];
};


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  estConnecte : boolean = false
  chat: string = "assets/photos/chat3.jpg";
  chat2 : string = ""
  or: string = "assets/photos/or.png";
  argent: string = "assets/photos/argent.png";
  bronze: string = "assets/photos/bronze.png";
  username:string = "";
  numberone : UserLikes[] = [];
  numbertwo : UserLikes[] = [];
  numberthree : UserLikes[] = [];




 photos: Photo[] = [
  {
    id: 0,
    is_published: false,
    likes: [],
    owner: 0,
    timestamp: "",
    title: "",
    uploaded_at: "",
    username: "",
    photo: ""
  }
];

 videos: Video[] = [
  {
    id: 0,
    is_published: false,
    likes: [],
    owner: 0,
    timestamp: "",
    title: "",
    uploaded_at: "",
    username: "",
    video: ""
  }
];

profiles: Profile[] = [
  {
    id: 0,
    likes: [],
    profile_picture: "",
    username: ""
  }
];

userLikes: UserLikes[] = []; // Stocke les likes regroupés par username



// Créer un tableau podium qui peut contenir des éléments de type Photo, Video, ou Profile
podium: CombinedItem[] = []; // Type changé à CombinedItem[]


    constructor( private points: PointscountService){
    }
  
   
    ngOnInit() {
      Promise.all([
        this.loadpointstest(),
        this.loadpointsprofile(),
        this.loadpointsvideos()
      ]).then(() => {
        console.log("Photos:", this.photos);
        console.log("Videos:", this.videos);
        console.log("Profiles:", this.profiles);
    
        // Combine tous les éléments dans un seul tableau
        const podium: PodiumItem[] = [...this.photos, ...this.videos, ...this.profiles];
    
        // Utilisation de reduce pour regrouper les likes par ID et garder le username
        const combinedData = podium.reduce<{ [key: number]: CombinedItem }>((acc, item) => {
          // Vérifie si l'ID est déjà dans le tableau
          if (!acc[item.id]) {
            acc[item.id] = { id: item.id, likes: [], username: item.username || "" };
          }
    
          // Combine les likes
          acc[item.id].likes = acc[item.id].likes.concat(item.likes);
    
          // Si username est défini, mettez à jour
          if (item.username) {
            acc[item.id].username = item.username;
          }
    
          return acc;
        }, {});
    
        // Transformation en tableau pour obtenir l'objet final
        const result = Object.values(combinedData);
    
        // Assignez le résultat transformé à podium
        this.podium = result;
    
        // Regrouper les likes par username
        const userLikesData = this.podium.reduce<{ [username: string]: UserLikes }>((acc, item) => {
          if (!acc[item.username]) {
            acc[item.username] = { username: item.username, totalLikes: [] };
          }
    
          acc[item.username].totalLikes = acc[item.username].totalLikes.concat(item.likes);
    
          return acc;
        }, {});
    
        // Transformation en tableau pour obtenir l'objet final regroupé
        this.userLikes = Object.values(userLikesData);
        this.userLikes.sort((a, b) => b.totalLikes.length - a.totalLikes.length);
        console.log("Podium final:", this.podium);
        console.log("User likes regroupés:", this.userLikes);
    
        this.userLikes.forEach((user: UserLikes, index: number, array: UserLikes[]) => {  // Utilisation de fonction fléchée ici
          if (this.numberone.length < 1) {
            this.numberone.push(user);
            // Ajoutez votre logique ici
          } else if (this.numberone.length == 1) {
            if (user.totalLikes.length == this.numberone.slice(-1)[0].totalLikes.length) {
              this.numberone.push(user);
            } else {
              if (this.numbertwo.length < 1) {
                this.numbertwo.push(user);
              } else if (this.numbertwo.length == 1) {
                if (user.totalLikes.length == this.numbertwo.slice(-1)[0].totalLikes.length) {
                  this.numbertwo.push(user);
                } else {
                  if (this.numberthree.length < 1) {
                    this.numberthree.push(user);
                  } else if (this.numberthree.length == 1) {
                    if (user.totalLikes.length == this.numberthree.slice(-1)[0].totalLikes.length) {
                      this.numberthree.push(user);
                    }
                  }
                }
              }
            }
          }
        });
        console.log("number 1", this.numberone);
      console.log("number 2", this.numbertwo)
      console.log("number 3", this.numberthree)
      }).catch(error => {
        console.error('Erreur lors du chargement des données:', error);
      });
      

    }
    
    async loadpointstest() {
      try {
        const response:Photo[] = await firstValueFrom(this.points.getphotoscount());
        this.photos = response;
        console.log('Loaded profile image:', this.photos);
      } catch (error) {
        console.log(error)
          
    }
}

async loadpointsprofile() {
  try {
    const response:Profile[] = await firstValueFrom(this.points.getprofilecount());
    this.profiles = response;
    console.log('Loaded profile imagessssssssssssssssssssssssssssss:', this.profiles);
    this.chat2 = this.profiles[3].profile_picture
    console.log(this.chat2)

  } catch (error) {
    console.log(error)
      
}
}async loadpointsvideos() {
  try {
    const response: Video[] = await firstValueFrom(this.points.getvideoscount());
    this.videos = response;
    console.log('Loaded profile image:', this.videos);
  } catch (error) {
    console.log(error)
      
}
}



}

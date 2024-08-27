import { Component, OnInit } from '@angular/core';
import { faTimes, faHeart } from '@fortawesome/free-solid-svg-icons';
import { LikesprofileService } from '../likesprofile.service';
import { UserService } from '../user.service';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface User {
  user: {
    id: number;       // ID de l'utilisateur
    username: string; // Nom d'utilisateur
  };
  profile_picture: string | null;
  likes?: number[];  // Propriété optionnelle pour les likes
}

@Component({
  selector: 'app-tinder',
  templateUrl: './tinder.component.html',
  styleUrls: ['./tinder.component.scss'],
  animations: [
    trigger('likeAnimation', [
      state('default', style({
        transform: 'scale(1)',
        backgroundColor: 'white'
      })),
      state('liked', style({
        transform: 'scale(1.1)',
        backgroundColor: '#FFD700'
      })),
      transition('default => liked', [
        animate('300ms ease-in')
      ]),
      transition('liked => default', [
        animate('300ms ease-out')
      ])
    ])
  ]
})
export class TinderComponent implements OnInit {
  faTimes = faTimes;
  faHeart = faHeart;
  users: User[] = [];
  username: string | null = null;
  animationStates: string[] = ['default', 'default'];
  count: number[] = [0, 1]; // Indices pour les photos gauche et droite

  constructor(
    private profile: LikesprofileService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Initial count:', this.count); // Devrait afficher [0, 1]
    this.getuser();
  }

  async getuser(): Promise<void> {
    const userId = this.userService.getUserId();
    if (userId) {
      try {
        const all_users: User[] = await firstValueFrom(this.profile.getAllprofile());
          this.getUserIdByUsername(userId)
        this.users = all_users.filter(user => user.profile_picture !== null);
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",all_users)
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      }
    }
  }

  updatePhotoIndices(): void {
    if (this.users.length > 1) {
        this.count[0] += 2; // Passe à l'utilisateur suivant (ex: de 0 à 2)
        this.count[1] += 2; // Passe à l'utilisateur suivant (ex: de 1 à 3)
    }
    console.log("????????????????????????????????????????????????????????",this.count)
  }

  getUserIdByUsername(username: string): number | null {
    const user = this.users.find(profile => profile.user.username === username);
    return user ? user.user.id : null;
  }

  async createsprofilelike(index: number): Promise<void> {
    if (this.users.length > this.count[index]) {
        const userId = this.userService.getUserId();
        console.log("User ID:", userId);
        console.log("Users Array:", this.users);

        if (userId) {
            const user = this.users[this.count[index]]; // Accéder à l'utilisateur correct

            // Vérification de l'existence de `user`, `user.user` et `user.user.id`
            if (user && user.user && user.user.id) {
                const use = user.user.id;

                // Vérification si l'utilisateur a déjà liké
                if (!user.likes?.includes(use)) {
                    console.log("User to be liked:", use);
                    try {
                        await this.profile.test(use).toPromise();
                    } catch (error) {
                        console.error("Erreur lors de la création du like :", error);
                    }

                    this.updatePhotoIndices();
                    this.animationStates[index] = 'liked';
                    setTimeout(() => {
                        this.animationStates[index] = 'default';
                    }, 1000);
                    this.cdr.detectChanges();
                } else {
                    this.updatePhotoIndices();
                }
            } else {
                this.updatePhotoIndices();
            }
        }
    }
}

  }

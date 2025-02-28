import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UploadService } from '../upload.service';
import { LoginService } from '../login.service';
import { HttpErrorResponse } from '@angular/common/http';  // Import nécessaire pour la gestion des erreurs HTTP
import { faSearch, faUpload, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth.service';
import { library } from '@fortawesome/fontawesome-svg-core';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

library.add(faSearch, faUpload);

@Component({
  selector: 'app-listefans',
  templateUrl: './listefans.component.html',
  styleUrls: ['./listefans.component.scss']
})
export class ListefansComponent implements OnInit {
  fileName: string = '';
  profileImageUrl: string | null = null;
  photosUrl: string ="";
  videosUrl: string ="";
  photosTest: any [] = [];
  videosTest: any [] = [];

  defaultProfileImageUrl:string ="assets/photos/chat4.jpg";

  liste_empty: boolean = false;
  list_fans: { id: number; name: string; birthYear: number; favoriteSeries: string[] }[] = [];
  is_disabled: boolean = false;
  show_videos: boolean = false;
  show_race: boolean = false;
  bgColor: string = "";
  show_photos: boolean = true;
  uploadForm!: FormGroup;
  user: string = "";
  faSearch = faSearch;
  faUpload = faUpload;
  faFolderOpen = faFolderOpen;
  username: string | null = null;
  test: string|null = 'https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/image-gallery/images/img-1.webp';
  source: string | null = null;
  previous_videos_route:boolean = false


  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private upload: UploadService,
    private login: LoginService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private userService: UserService,

  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // Récupération du paramètre 'id' de la route
      this.username = params.get('id');
  
      // Abonnement à queryParamMap pour récupérer les query parameters
      this.route.queryParamMap.subscribe(queryParams => {
        // Récupération du query parameter 'source'
        this.source = queryParams.get('source');
        console.log('Source:', this.source);
  
        // Exemple de logique basée sur la source
        if (this.source === 'previousRoute') {
          console.log('Provenance: Photos');
          this.previous_videos_route = true
          this.show_videos = true;
          this.videoschats();
          // Logique pour traiter la navigation depuis Photos
        } else if (this.source === 'nextRoute') {
          console.log('Provenance: Videos');
          this.previous_videos_route = false
          this.show_photos = true;
          this.photoschats();

          // Logique pour traiter la navigation depuis Videos
        }
      });
  
      // Vérifier si l'ID de l'utilisateur est déjà enregistré dans le UserService
      const storedUserId = this.userService.getUserId();
      if (storedUserId) {
        this.username = storedUserId; // Utiliser l'ID enregistré s'il existe déjà
      } else {
        // Si l'ID n'est pas encore enregistré, enregistrer et utiliser celui récupéré de la route
        this.userService.setUserId(this.username);
      }

      console.log('salut staré:', this.username);
      
      // Appeler les fonctions de chargement après avoir obtenu les paramètres de la route
      this.loadProfileImage();
      this.loadphotos();
      this.photoschats();
    });
  }

  async loadProfileImage() {
    try {
      const response = await firstValueFrom(this.upload.getProfilePhoto());
      this.profileImageUrl = response.profile_picture;
      console.log('Loaded profile image:', this.profileImageUrl);
    } catch (error) {
      const httpError = error as HttpErrorResponse;  // Utilisation d'une assertion de type pour l'erreur
      if (error && httpError.status === 403) {
        console.log('Erreur 403, tentative de rafraîchir le token CSRF');
        try {
          await firstValueFrom(this.upload.refreshCsrfToken());
          const retryResponse = await firstValueFrom(this.upload.getProfilePhoto());
          this.profileImageUrl = retryResponse.profile_picture;
          console.log('Loaded profile image after refreshing CSRF token:', this.profileImageUrl);
        } catch (refreshError) {
          console.error('Erreur lors du rafraîchissement du token CSRF', refreshError);
        }
      } else {
        console.error('Erreur lors du chargement de l\'image de profil', error);
      }
    }
  }

  async loadphotos() {
    try {
      const response = await firstValueFrom(this.upload.getPhoto());
      this.photosUrl = response.photo;
      console.log('Loaded photo:', this.photosUrl);
    } catch (error) {
      const httpError = error as HttpErrorResponse;  // Utilisation d'une assertion de type pour l'erreur
      if (error && httpError.status === 403) {
        console.log('Erreur 403, tentative de rafraîchir le token CSRF');
        try {
          await firstValueFrom(this.upload.refreshCsrfToken());
          const retryResponse = await firstValueFrom(this.upload.getPhoto());
          this.photosUrl = retryResponse.photo;
          console.log('Loaded photo after refreshing CSRF token:', this.profileImageUrl);
        } catch (refreshError) {
          console.error('Erreur lors du rafraîchissement du token CSRF', refreshError);
        }
      } else {
        console.error('Erreur lors du chargement de l\'image de profil', error);
      }
    }
  }


  selectFile(): void {
    console.log("ici")
    this.fileInput.nativeElement.click();

  }

  selectFile1(): void {
    console.log("ici1")

    this.show_photos = true;
    this.fileInput.nativeElement.click();

  }

  selectFile2(): void {
    console.log("ici2")

    this.show_videos = true;
    this.fileInput.nativeElement.click();

  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
    } else {
      console.error('No file selected or invalid file.');
    }
  }

  onFileSelected1(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
    } else {
      console.error('No file selected or invalid file.');
    }
  }

  onFileSelected2(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
    } else {
      console.error('No file selected or invalid file.');
    }
  }

  async onSubmit(): Promise<void> {
    const fileInputElement = this.fileInput.nativeElement;
    const file: File | null = fileInputElement.files?.[0] || null;
    if (file) {
      const formData = new FormData();
      formData.append('profile_picture', file);

      try {
        const response = await firstValueFrom(this.upload.createPhotoProfile(formData));
        console.log('Enregistrement réussi', response);
        this.profileImageUrl = response.profile_picture;

      } catch (error) {
        console.error('Erreur de connexion', error);
      }
    } else {
      console.error('Aucun fichier sélectionné.');
    }
  }

  async onSubmit1(): Promise<void> {
    const fileInputElement = this.fileInput.nativeElement;
    const file: File | null = fileInputElement.files?.[0] || null;
    if (file) {
      const formData1 = new FormData();
      formData1.append('photo', file);

      try {
        console.log("salut mon gros")
        const response = await firstValueFrom(this.upload.createPhoto(formData1));
        console.log('Enregistrement réussi', response);
        this.photosUrl= response.photo;
        await this.photoschats();

      } catch (error) {
        console.error('Erreur de connexion', error);
      }
    } else {
      console.error('Aucun fichier sélectionné.');
    }
  }

  async onSubmit2(): Promise <void>  {
    const fileInputElement = this.fileInput.nativeElement;
    const file: File | null = fileInputElement.files?.[0] || null;
    if (file) {
      const formData1 = new FormData();
      formData1.append('video', file);

      try {
        console.log("salut mon gros")
        const response = await firstValueFrom(this.upload.createVideo(formData1));
        console.log('Enregistrement réussi', response);
        this.photosUrl= response.video;
        await this.videoschats();

        
      } catch (error) {
        console.error('Erreur de connexion', error);
      }
    } else {
      console.error('Aucun fichier sélectionné.');
    }
    
  }

  async videoschats(): Promise<void> {

    try {
    const response = await firstValueFrom(this.upload.getVideo());
    console.log("t",response);    
    this.videosTest = response
    console.log("chevauxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",this.videosTest)
    
  
    
  } 
    catch (error) {
      console.error('Erreur de connexion', error);
    }
    this.show_videos = true; // Réinitialiser l'état des photos
    this.show_photos = false;
    this.show_race = false; // Réinitialiser l'état des photos
  }


  async photoschats(): Promise<void> {

    try {
    const response = await firstValueFrom(this.upload.getPhoto());
    console.log("t",response);    
    this.photosTest = response
    console.log("chevauxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",this.photosTest)
    
  
    
  } 
    catch (error) {
      console.error('Erreur de connexion', error);
    }
  
    this.show_photos = true;
    this.show_videos = false; // Réinitialiser l'état des photos
    this.show_race = false; // Réinitialiser l'état des photos
  }

  race(): void {
    console.log("ddddddddddddddddddddddddddddddddddddd");
    this.show_race = true;
    this.show_videos = false; // Réinitialiser l'état des photos
    this.show_photos = false; // Réinitialiser l'état des photos
  }


  onPhotosUpdated(updatedPhotos: any[]): void {
    this.photosTest = updatedPhotos;
    console.log("yessssssssssssssssssssssssssssss")
  }

  onVideosUpdated(updatedVideos: any[]): void {
    this.videosTest = updatedVideos;
  }
}

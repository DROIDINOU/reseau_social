


import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UploadService } from '../upload.service';
import { LoginService } from '../login.service';
import { HttpErrorResponse } from '@angular/common/http';  // Import nécessaire pour la gestion des erreurs HTTP
import { faSearch,fas, faUpload,faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth.service';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faSearch, faUpload);
@Component({
  selector: 'app-listefans',
  templateUrl: './listefans.component.html',
  styleUrls: ['./listefans.component.scss']
})
export class ListefansComponent implements OnInit {
  fileName: string = '';
  profileImageUrl: string | null = null;
  liste_empty : boolean = false
  list_fans: { id: number; name: string; birthYear: number; favoriteSeries: string[] }[] =[]
  is_disabled : boolean = false
  show_videos : boolean = false
  show_race : boolean = false
  bgColor : string = ""
  show_photos: boolean = false
  uploadForm!: FormGroup;
  user :string = ""
  faSearch = faSearch
  faUpload = faUpload
  faFolderOpen = faFolderOpen
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private formBuilder: FormBuilder, private upload: UploadService, private login: LoginService, public authService: AuthService) { }

  ngOnInit() {
    this.loadProfileImage();
  }

  async loadProfileImage() {
    try {
      const response = await this.upload.getProfilePhoto().toPromise();
      this.profileImageUrl = `http://localhost:8000${response.profile_picture}`;
      console.log('Loaded profile image:', this.profileImageUrl);
    } catch (error) {
      const httpError = error as HttpErrorResponse;  // Utilisation d'une assertion de type pour l'erreur
      if (error && httpError.status === 403) {
        console.log('Erreur 403, tentative de rafraîchir le token CSRF');
        try {
          await this.upload.refreshCsrfToken().toPromise();
          const retryResponse = await this.upload.getProfilePhoto().toPromise();
          this.profileImageUrl = `http://localhost:8000${retryResponse.profile_picture}`;
          console.log('Loaded profile image after refreshing CSRF token:', this.profileImageUrl);
        } catch (refreshError) {
          console.error('Erreur lors du rafraîchissement du token CSRF', refreshError);
        }
      } else {
        console.error('Erreur lors du chargement de l\'image de profil', error);
      }
    }
  }

  selectFile(): void {
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

  async onSubmit(): Promise<void> {
    const fileInputElement = this.fileInput.nativeElement;
    const file: File | null = fileInputElement.files?.[0] || null;
    if (file) {
      const formData = new FormData();
      formData.append('profile_picture', file);

      try {
        const response = await this.upload.createPhotoProfile(formData).toPromise();
        console.log('Enregistrement réussi', response);
        this.profileImageUrl = `http://localhost:8000/${response.profile_picture}`;
      } catch (error) {
        console.error('Erreur de connexion', error);
      }
    } else {
      console.error('Aucun fichier sélectionné.');
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

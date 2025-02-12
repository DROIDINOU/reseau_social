import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './shared/home/home.component';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { BindingComponent } from './components/demos/binding/binding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeComponent } from './components/demos/pipe/pipe.component';
import { FormatterPipe } from './tools/pipes/formatter.pipe';
import { ReductionPipe } from './tools/pipes/reduction.pipe';
import { ChronometreComponent } from './components/exos/chronometre/chronometre.component';
import { DirectivesComponent } from './components/demos/directives/directives.component';
import { SurbrillanceDirective } from './tools/directives/surbrillance.directive';
import { ListeProduitsComponent } from './components/exos/liste-produits/liste-produits.component';
import { ParentComponent } from './components/demos/inputOutput/parent/parent.component';
import { EnfantComponent } from './components/demos/inputOutput/enfant/enfant.component';
import { AffichageListeComponent } from './components/exos/shoppingList/affichage-liste/affichage-liste.component';
import { AjoutArticleComponent } from './components/exos/shoppingList/ajout-article/ajout-article.component';
import { ShoppingComponent } from './components/exos/shoppingList/shopping/shopping.component';
import { LivreServiceComponent } from './components/demos/livre-service/livre-service.component';
import { ShoppingListServiceComponent } from './components/exos/shopping-list-service/shopping-list-service.component';
import { FormulaireComponent } from './components/demos/formulaire/formulaire.component';
import { ProfilUtilisateurComponent } from './components/demos/routing/profil-utilisateur/profil-utilisateur.component';
import { RoutingComponent } from './components/demos/routing/routing/routing.component';
import { FormulairecrudComponent } from './formulairecrud/formulairecrud.component';
import { ListefansComponent } from './listefans/listefans.component';
import { ConsoapiComponent } from './consoapi/consoapi.component';
import { HttpClientModule, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { VideochatComponent } from './videochat/videochat.component';
import { PhtochatComponent } from './phtochat/phtochat.component';
import { CaractereComponent } from './caractere/caractere.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PhotospostComponent } from './photospost/photospost.component';
import { RacechatComponent } from './racechat/racechat.component';
import { QuoideneufComponent } from './quoideneuf/quoideneuf.component';
import { Categchat1Component } from './categchat1/categchat1.component';
import { Categchat2Component } from './categchat2/categchat2.component';
import { Categchat3Component } from './categchat3/categchat3.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CoeurComponent } from './coeur/coeur.component';
import { CatlogoComponent } from './catlogo/catlogo.component';
import { CommentsComponent } from './comments/comments.component';
import { PoucesComponent } from './pouces/pouces.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalcommentsComponent } from './modalcomments/modalcomments.component';
import { ModalgeneralComponent } from './modalgeneral/modalgeneral.component';
import { FriendrequestpageComponent } from './friendrequestpage/friendrequestpage.component';
import { ModallistfriendsComponent } from './modallistfriends/modallistfriends.component';
import { AccessphotosfromprofileComponent } from './accessphotosfromprofile/accessphotosfromprofile.component';
import { ModalphotoComponent } from './modalphoto/modalphoto.component';
import { ModalgeneralphotoComponent } from './modalgeneralphoto/modalgeneralphoto.component';
import { CoeurphotoComponent } from './coeurphoto/coeurphoto.component';
import { ModalvideoComponent } from './modalvideo/modalvideo.component';
import { ModalgeneralvideoComponent } from './modalgeneralvideo/modalgeneralvideo.component';
import { VideopostComponent } from './videopost/videopost.component';
import { CoeurvideoComponent } from './coeurvideo/coeurvideo.component';
import { AnimatedRopeComponent } from './animated-rope/animated-rope.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TinderComponent } from './tinder/tinder.component';
import { NoimageComponent } from './noimage/noimage.component';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBarModule
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'; // Pour les boutons
import { MatExpansionModule } from '@angular/material/expansion';
import { FooterComponent } from './footer/footer.component'; // Pour mat-expansion-panel
import { MatIconModule } from '@angular/material/icon';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ScrollPreventionServiceService } from './scroll-prevention-service.service';
import { FooterindicationsComponent } from './footerindications/footerindications.component';
import { ChatmessagemodalComponent } from './chatmessagemodal/chatmessagemodal.component';


@NgModule({
  declarations: [
    AppComponent,
    BindingComponent,
    HomeComponent,
    NavBarComponent,
    PipeComponent,
    FormatterPipe,
    ReductionPipe,
    ChronometreComponent,
    DirectivesComponent,
    SurbrillanceDirective,
    ListeProduitsComponent,
    ParentComponent,
    EnfantComponent,
    AffichageListeComponent,
    AjoutArticleComponent,
    ShoppingComponent,
    LivreServiceComponent,
    ShoppingListServiceComponent,
    FormulaireComponent,
    ProfilUtilisateurComponent,
    RoutingComponent,
    FormulairecrudComponent,
    ListefansComponent,
    ConsoapiComponent,
    VideochatComponent,
    PhtochatComponent,
    CaractereComponent,
    PhotospostComponent,
    RacechatComponent,
    QuoideneufComponent,
    Categchat1Component,
    Categchat2Component,
    Categchat3Component,
    LoginComponent,
    RegisterComponent,
    CoeurComponent,
    CatlogoComponent,
    CommentsComponent,
    PoucesComponent,
    ModalcommentsComponent,
    ModalgeneralComponent,
    FriendrequestpageComponent,
    ModallistfriendsComponent,
    AccessphotosfromprofileComponent,
    ModalgeneralphotoComponent,
    ModalphotoComponent,
    CoeurphotoComponent,
    ModalvideoComponent,
    ModalgeneralvideoComponent,
    VideopostComponent,
    CoeurvideoComponent,
    AnimatedRopeComponent,
    TinderComponent,
    NoimageComponent,
    FooterComponent,
    FooterindicationsComponent,
    ChatmessagemodalComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    InfiniteScrollModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatSnackBarModule,       // Ajouter MatSnackBarModule ici
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    NgScrollbarModule,





  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

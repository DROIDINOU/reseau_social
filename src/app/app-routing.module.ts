import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { BindingComponent } from './components/demos/binding/binding.component';
import { PipeComponent } from './components/demos/pipe/pipe.component';
import { ChronometreComponent } from './components/exos/chronometre/chronometre.component';
import { DirectivesComponent } from './components/demos/directives/directives.component';
import { ListeProduitsComponent } from './components/exos/liste-produits/liste-produits.component';
import { ParentComponent } from './components/demos/inputOutput/parent/parent.component';
import { ShoppingComponent } from './components/exos/shoppingList/shopping/shopping.component';
import { LivreServiceComponent } from './components/demos/livre-service/livre-service.component';
import { ListefansComponent } from './listefans/listefans.component';
import { ShoppingListServiceComponent } from './components/exos/shopping-list-service/shopping-list-service.component';
import { FormulaireComponent } from './components/demos/formulaire/formulaire.component';
import { RoutingComponent } from './components/demos/routing/routing/routing.component';
import { ProfilUtilisateurComponent } from './components/demos/routing/profil-utilisateur/profil-utilisateur.component';
import { authGuard } from './tools/guards/auth.guard';
import { FormulairecrudComponent } from './formulairecrud/formulairecrud.component'; 
import { FanpageComponent } from './fanpage/fanpage.component';
import { ConsoapiComponent } from './consoapi/consoapi.component';
import { VideochatComponent } from './videochat/videochat.component';
import { PhtochatComponent } from './phtochat/phtochat.component';
import { PhotospostComponent} from './photospost/photospost.component';
import { RacechatComponent } from './racechat/racechat.component';
import { QuoideneufComponent } from './quoideneuf/quoideneuf.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth-guard.service';
import { FriendrequestpageComponent } from './friendrequestpage/friendrequestpage.component';
import { AccessphotosfromprofileComponent } from './accessphotosfromprofile/accessphotosfromprofile.component';

const routes: Routes = [
        { path: 'home', component: HomeComponent},
        { path: 'routing', component: RoutingComponent},
        { path: 'fanslist/:userId', component: ListefansComponent},
        { path: 'friend/:id', component: ListefansComponent},
        { path: 'phtochat/:userId', component: PhtochatComponent},
        { path: 'photospost', component: PhotospostComponent},
        { path: 'racechat', component: RacechatComponent},
        { path: 'quoideneuf', component: QuoideneufComponent},
        { path: 'login', component: LoginComponent},
        { path: 'register', component: RegisterComponent},
        { path: 'user-profile/:id', component: PhtochatComponent, canActivate: [AuthGuard] },
        { path: 'user-prof/:id', component: PhtochatComponent },
        { path: 'userprofile/:id', component: FriendrequestpageComponent },
        { path: 'access', component: AccessphotosfromprofileComponent },
        { path: '', redirectTo: 'home', pathMatch: 'full'} // Redirection par défault
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

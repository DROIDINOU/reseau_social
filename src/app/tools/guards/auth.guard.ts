import { inject } from '@angular/core';
import { CanActivateFn , Router} from '@angular/router';
import { FakeAuthService } from '../services/fake-auth.service';
import { truncate } from 'fs';

export const authGuard: CanActivateFn = (route, state) => {

    // Même logique que le constructeur en version 17 Angular
    const authService = inject(FakeAuthService)
    const router = inject(Router)

    if(authService.estConnecte()){
        return true
    } else{
        return router.navigate(['/demos/routing'])
    }
};

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FakeAuthService {
    private connecte : boolean = false

    login(username : string, password : string) : boolean{
        if(username === "username" && password === "password"){
            this.connecte = true
            return true
        }
        return false
    }

    logout() :void {
        this.connecte = false
    }

    estConnecte() : boolean{
        return this.connecte
    }
}

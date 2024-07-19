import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  userId: string | null = null;

  setUserId(userId: string|null) {

    this.userId = userId;
    console.log("set",this.userId)

  }

  getUserId(): string | null {
    console.log("get",this.userId)
    return this.userId;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  dummyRegNum="120004213";
  dummyPass="12021999";
  dummyAuth(regnum,pswrd){
    if((regnum==this.dummyRegNum)&&(pswrd==this.dummyPass))
    {
      return true;
    }
    else{
      return false;
    }
  }

  sendForAuth(){
    //send for auth to server
    //counting on u memes
  }

}

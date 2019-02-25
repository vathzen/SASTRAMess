import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  //dummyRegNum="120004213";
  //dummyPass="12021999";
  Users = ["120014052","120004213"];
  Passwords = ["03111998","12021999"];

  dummyAuth(regnum,pswrd){
      var a = this.Users.indexOf(regnum);
      if(a == -1){
          return false;
          //so that we can say user doesnt exist
      }else{
          if(pswrd == this.Passwords[a]){
              return true;
              //login
          }else{
              return false;
              //so that we can say incorrect login
          }
      }
  }


  sendForAuth(){
    //send for auth to server
    //counting on u memes
  }

}

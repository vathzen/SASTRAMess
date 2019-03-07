import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  Users = [120014052,120004213];
  Passwords = [3111998,12021999];
  link='';
  constructor() {
    this.link = 'localhost:8080/users';
  }

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


  sendForAuth(regnum,pswrd){
    //send for auth to server
    //counting on u memes

  }

}

import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RestService } from './rest.service';
import { UserDet } from './UserDet';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  Users = [120014052,120004213];
  Passwords = [3111998,12021999];
  userDet: any;
  constructor(public restService: RestService, public loadingController: LoadingController) {
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


   sendForAuth(regnum,pswrd){//async
    //send for auth to server
    //counting on u memes
    var user:UserDet = new UserDet();
    user.username = regnum;
    user.password = pswrd;
    user.exist = false;

    //const loading = this.loadingController.create({
    //    message: 'Loading',
    //    spinner: 'crescent'
    //});
    //loading.present();
    this.restService.userAuth(user)
        .subscribe(res => {
            console.log(res);
            this.userDet = res;
            //loading.dismiss();
        },err => {
            console.log(err);
            //loading.dismiss();
        })

        return true;
  }
}

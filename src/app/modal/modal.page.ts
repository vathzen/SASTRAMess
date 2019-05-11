import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import anime from 'node_modules/animejs/lib/anime.js';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  
  @Input() checks: any[];

  constructor(private modalController: ModalController, private loadingController: LoadingController) { }
  buttonColor:string='dark';
  updationSuccess:boolean=null;
  updationFailure:boolean=null;
  spinnerVisible:boolean=true;
  headerData:string=null;
  subheaderData:string=null;
  vibrate_times:number=0;

  ngOnInit() {
    //this.sendData();
  }

  sendData(){      
    console.log(this.checks); //Use this array for orders
    this.updationSuccess = true; //STORE SUCCESS OR FAILURE OF UPDATION HERE
    this.updationFailure = !this.updationSuccess; //this line may look stupid but important!
    
    this.onAckRcv();
  }

  pseudoAckRcv(val:boolean){ //this func for testing
    this.updationSuccess=val;
    this.updationFailure=!this.updationSuccess;
    this.onAckRcv();
  }

  onAckRcv(){
    if(this.updationSuccess){
      anime({
        targets: '.symbol',
        rotateY: 360,
        duration: 400,
        easing: 'easeInOutSine'
      });
      this.buttonColor='success';
      this.headerData='Success!';
      this.subheaderData='Your order has been updated.';      
    }
    else{
      this.vibrate();
      this.buttonColor='danger';
      this.headerData='Failure!';
      this.subheaderData='Something went wrong.';
    }
  }

  vibrate(){
    var self=this;
    anime({
      targets: '.symbol',
      translateX: -2,
      duration: 30,
      complete (){
        anime({
          targets: '.symbol',
          translateY: -3,
          duration: 10,
          complete(){
            anime({
              targets: '.symbol',
              translateX: 4,
              duration: 10,
              complete(){
                anime({
                  targets: '.symbol',
                  translateY: 0,
                  duration: 10,
                  complete(){
                    anime({
                      targets: '.symbol',
                      translateX: 0,
                      duration: 10,
                      complete(){
                        self.vibrate_times++
                        if(self.vibrate_times<=1){
                          self.vibrate();
                        }
                        else{
                          self.vibrate_times=0;
                        }
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  closeModal(){
    this.modalController.dismiss(this.updationSuccess);
  }
}

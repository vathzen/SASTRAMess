import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  
  @Input() checks: any[];

  constructor(private modalController: ModalController) { }
  buttonColor:string='dark';
  updationSuccess:boolean=null;
  updationFailure:boolean=null;
  spinnerVisible:boolean=true;
  headerData:string=null;
  subheaderData:string=null;

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
      this.buttonColor='success';
      this.headerData='Success!';
      this.subheaderData='Your order has been updated.';
    }
    else{
      this.buttonColor='danger';
      this.headerData='Failure!';
      this.subheaderData='Something went wrong.';
    }
  }

  closeModal(){
    this.modalController.dismiss(this.updationSuccess);
  }
}

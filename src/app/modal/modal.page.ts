import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  
  @Input() checks: any[];
  @Input() deleteRow: any;

  constructor(private modalController: ModalController, private loadingController: LoadingController) { }
  buttonColor:string='dark';
  updationSuccess:boolean=null;
  updationFailure:boolean=null;
  spinnerVisible:boolean=true;
  headerData:string=null;
  subheaderData:string=null;
  msgData:string=null;

  ngOnInit() {
    //this.sendData();
  }

  sendData(){ //IF DELETE ROW IS FALSE, USE INSERT... IF SUCCESSFUL, STORE ACKNOWLEDGEMENT       
    console.log(this.deleteRow,this.checks);
    this.updationSuccess = true; //STORE SUCCESS OR FAILURE OF UPDATION HERE
    this.updationFailure = !this.updationSuccess //this line may look stupid but important!
    
    this.ackRcv();
  }

  pseudoAckRcv(val:boolean){ //this func for testing
    this.updationSuccess=val;
    this.updationFailure=!this.updationSuccess;
    this.ackRcv();
  }

  ackRcv(){
    if(this.updationSuccess){
      this.buttonColor='success';
      this.headerData='Success!';
      this.subheaderData='Your order has been updated.';
      this.msgData='Modifications if needed can be made before 11:00pm.';
    }
    else{
      this.buttonColor='danger';
      this.headerData='Failure!';
      this.subheaderData='Something went wrong.';
      this.msgData='Check your connectoion and try again.';
    }
  }

  closeModal(){
    this.modalController.dismiss();
  }
}

import { Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-month-wise',
  templateUrl: './month-wise.page.html',
  styleUrls: ['./month-wise.page.scss'],
})
export class MonthWisePage implements OnInit {

  constructor(private restService: RestService) { }
  public entries=[];
  costTotal:number=null;
  daysTotal:number=null;
  mealsTotal:number=null;
  month=new Date().toISOString().split('T')[0];
  maxmonth=null;
  itemHighlighted:boolean=null;
  dateHighlighted:boolean=null;
  costHighlighted:boolean=null;
  dateSortAsc=false;
  itemSortAsc=false;
  costSortAsc=false;
  itemSortNeeded=true;

  ngOnInit() {
    this.getPage();
    this.maxmonth=this.month;
  }

  getPage(){
    console.log(this.month.split('T')[0].split('-')[1]);//use this date to get data
    var month =  this.month.split('T')[0].split('-')[1];
    this.restService.getHistory(month,120014052).subscribe(
        (val) =>{
            console.log(val)
        },
        (err) =>{
            console.log(err)
        }
    );
    let data = [{ //assuming we get this
      "date" : "01-04-2019",
      "bf1" : "Idly-2-43",
      "bf2" : "null-0-0",
      "lun1" : "Poori-3-77",
      "lun2" : "null-0-0",
      "din1" : "null-0-0",
      "din2" : "Lasagna-4-13",
    },
      {
      "date" : "02-04-2019",
      "bf1" : "Dosa-2-43",
      "bf2" : "null-0-0",
      "lun1" : "Poori-3-77",
      "lun2" : "Lasagna-4-13",
      "din1" : "null-0-0",
      "din2" : "Lasagna-4-13",
    },
    {
      "date" : "03-04-2019",
      "bf1" : "Vada-2-43",
      "bf2" : "null-0-0",
      "lun1" : "Poori-3-77",
      "lun2" : "Lasagna-4-13",
      "din1" : "null-0-0",
      "din2" : "Lasagna-4-13",
    },{
      "date" : "04-04-2019",
      "bf1" : "Vada-2-43",
      "bf2" : "null-0-0",
      "lun1" : "Poori-3-77",
      "lun2" : "Lasagna-4-13",
      "din1" : "null-0-0",
      "din2" : "null-0-0",
    },]

    this.entries.splice(0,this.entries.length);
    this.costTotal=0;

    data.forEach(element => {
      let date = element.date.split('-')[0]+' '+new Date(this.month.split('T')[0]).toString().split(' ')[1];
      let splitted = element.bf1.split('-');
      if(splitted[0]!='null'){
        this.entries.push({date:date, icon:'partly-sunny', color:'success', itemname:splitted[0], quantity:splitted[2]+'x'+splitted[1], cost:+splitted[1]*+splitted[2]});
      }
      splitted = element.bf2.split('-');
      if(splitted[0]!='null'){
        this.entries.push({date:date, icon:'partly-sunny', color:'success', itemname:splitted[0], quantity:splitted[2]+'x'+splitted[1], cost:+splitted[1]*+splitted[2]});
      }
      splitted = element.lun1.split('-');
      if(splitted[0]!='null'){
        this.entries.push({date:date, icon:'sunny', color:'primary', itemname:splitted[0], quantity:splitted[2]+'x'+splitted[1], cost:+splitted[1]*+splitted[2]});
      }
      splitted = element.lun2.split('-');
      if(splitted[0]!='null'){
        this.entries.push({date:date, icon:'sunny', color:'primary', itemname:splitted[0], quantity:splitted[2]+'x'+splitted[1], cost:+splitted[1]*+splitted[2]});
      }
      splitted = element.din1.split('-');
      if(splitted[0]!='null'){
        this.entries.push({date:date, icon:'moon', color:'danger', itemname:splitted[0], quantity:splitted[2]+'x'+splitted[1], cost:+splitted[1]*+splitted[2]});
      }
      splitted = element.din2.split('-');
      if(splitted[0]!='null'){
        this.entries.push({date:date, icon:'moon', color:'danger', itemname:splitted[0], quantity:splitted[2]+'x'+splitted[1], cost:+splitted[1]*+splitted[2]});
      }
    });

    var dates=[];
    this.entries.forEach(element => {
      this.costTotal+=element.cost;
      dates.push(element.date);
    });
    this.daysTotal=Array.from(new Set(dates)).length;
    dates.splice(0,dates.length);
    this.mealsTotal=this.entries.length;
    this.sortDate();
  }

  sortDate(){
    this.dateHighlighted=true;
    this.itemHighlighted=false;
    this.costHighlighted=false;
    this.itemSortNeeded=true;
    this.itemSortAsc=false;
    this.costSortAsc=false;
    this.dateSortAsc=!this.dateSortAsc;
    if(this.dateSortAsc){
    this.entries.sort(function(a,b){
      return a.date.localeCompare(b.date);
    });
  }
  else{
    this.entries.sort(function(a,b){
      return b.date.localeCompare(a.date);
    });
  }
  }

  sortItem(){
    this.dateHighlighted=false;
    this.itemHighlighted=true;
    this.costHighlighted=false;
    this.itemSortNeeded=false;
    this.dateSortAsc=false;
    this.costSortAsc=false;
    this.itemSortAsc=!this.itemSortAsc;
    if(this.itemSortAsc){
    this.entries.sort(function(a,b){
      return a.itemname.localeCompare(b.itemname);
    });
  }
  else{
    this.entries.sort(function(a,b){
      return b.itemname.localeCompare(a.itemname);
    });
  }
}

  sortCost(){
    this.dateHighlighted=false;
    this.itemHighlighted=false;
    this.costHighlighted=true;
    this.dateSortAsc=false;
    this.itemSortAsc=false;
    this.costSortAsc=!this.costSortAsc;
    if(this.costSortAsc){
      if(this.itemSortNeeded){
        this.entries.sort(function(a,b){
          return a.itemname.localeCompare(b.itemname);
        });
    }
    this.entries.sort(function(a,b){
      return a.cost - b.cost;
    });
  }
  else{
    if(this.itemSortNeeded){
    this.entries.sort(function(a,b){
      return b.itemname.localeCompare(a.itemname);
    });
  }
    this.entries.sort(function(a,b){
      return b.cost - a.cost;
    });
  }
  }
}

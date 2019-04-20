import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-month-wise',
  templateUrl: './month-wise.page.html',
  styleUrls: ['./month-wise.page.scss'],
})
export class MonthWisePage implements OnInit {

  constructor() { }
  public entries=[
    {date:'10 Apr', itemname:'Gobi Manchurian Dry', cost:20},
    {date:'10 Apr', itemname:'Gobi Manchurian Dry', cost:20}
  ];
  costTotal:number=null;
  daysTotal:number=null;
  mealsTotal:number=null;
  month=new Date().toISOString().split('T')[0];
  itemHighlighted:boolean=null;
  dateHighlighted:boolean=null;
  costHighlighted:boolean=null;
  dateSortAsc=false;
  itemSortAsc=false;
  costSortAsc=false;
  itemSortNeeded=true;

  ngOnInit() {
    this.getPage();
  }

  getPage(){
    console.log(this.month.split('T')[0]);//use this date to get data
    this.entries.splice(0,this.entries.length);
    this.costTotal=0;
    //getnewdata
    this.entries.push({date:'10 Apr', itemname:'D', cost:30});
    this.entries.push({date:'11 Apr', itemname:'A', cost:40});
    this.entries.push({date:'12 Apr', itemname:'F', cost:40});
    this.entries.push({date:'13 Apr', itemname:'A', cost:40});

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
    //C ANIME.JS!!!
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
    //C ANIME.JS!!!
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

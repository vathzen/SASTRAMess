import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-wise',
  templateUrl: './item-wise.page.html',
  styleUrls: ['./item-wise.page.scss'],
})
export class ItemWisePage implements OnInit {

  constructor() { }

  public items=[
    {itemname:'Gobi Manchurian Dry', quantity:10, cost:200},
    {itemname:'Paneer Fried Rice', quantity:20, cost:300},
  ];
  public colors=['primary','secondary','tertiary','success','warning','danger','light','medium','dark'];
  costTotal:number=null;
  quantityTotal:number=null;
  itemHighlighted:boolean=null;
  quantHighlighted:boolean=null;
  costHighlighted:boolean=null;
  quantitySortAsc=false;
  itemSortAsc=false;
  costSortAsc=false;
  itemSortNeeded=true;

  ngOnInit() {
    this.getPage();
  }

  getPage(){
    this.items.splice(0,this.items.length);
    this.costTotal=0;
    //get new data and push
    this.items.push({itemname:'Gobi Manchurian Dry', quantity:9, cost:200});
    this.items.push({itemname:'Paneer Fried Rice', quantity:5, cost:300});
    this.items.push({itemname:'Masala Dosa', quantity:6, cost:300});
    this.items.push({itemname:'French Fries', quantity:8, cost:400});
    this.items.forEach(element => {
      this.quantityTotal+=element.quantity;
      this.costTotal+=element.cost;
    });
    this.sortItem();
  }

  sortItem(){
    //C ANIME.JS!!!
    this.itemHighlighted=true;
    this.quantHighlighted=false;
    this.costHighlighted=false;
    this.itemSortNeeded=false;
    this.quantitySortAsc=false;
    this.costSortAsc=false;
    this.itemSortAsc=!this.itemSortAsc;
    if(this.itemSortAsc){
    this.items.sort(function(a,b){ 
      return a.itemname.localeCompare(b.itemname);
    });
  }
  else{
    this.items.sort(function(a,b){ 
      return b.itemname.localeCompare(a.itemname);
    });
  }
}

sortQuantity(){
  //C ANIME.JS!!!
  this.itemHighlighted=false;
  this.quantHighlighted=true;
  this.costHighlighted=false;
  this.itemSortNeeded=true;
  this.itemSortAsc=false;
  this.costSortAsc=false;
  this.quantitySortAsc=!this.quantitySortAsc;
  if(this.quantitySortAsc){
  this.items.sort(function(a,b){ 
    return a.quantity - b.quantity;
  });
}
else{
  this.items.sort(function(a,b){ 
    return b.quantity - a.quantity;
  });
}
}

  sortCost(){
    this.itemHighlighted=false;
    this.quantHighlighted=false;
    this.costHighlighted=true;
    //C ANIME.JS!!!
    this.quantitySortAsc=false;
    this.itemSortAsc=false;
    this.costSortAsc=!this.costSortAsc;
    if(this.costSortAsc){
      if(this.itemSortNeeded){
        this.items.sort(function(a,b){ 
          return a.itemname.localeCompare(b.itemname);
        });
    }
    this.items.sort(function(a,b){
      return a.cost - b.cost;
    });
  }
  else{
    if(this.itemSortNeeded){
    this.items.sort(function(a,b){ 
      return b.itemname.localeCompare(a.itemname);
    });
  }
    this.items.sort(function(a,b){
      return b.cost - a.cost;
    });
  }
}

}

export class User {
   username: string;
   password: string;
   nickname: string;
   constructor(values: Object = {}) {
        Object.assign(this, values);
   }
}

export class Response {
    Status: string;
    Text: string;
    constructor(values: Object = {}){
        Object.assign(this, values);
    }
}

export class Checks {
    username: number;
    bf1: number;
    bf2: number;
    lun1: number;
    lun2: number;
    din1: number;
    din2: number;

    constructor(values: number[]){
        this.bf1 = values[0];
        this.bf2 = values[1];
        this.lun1 = values[2];
        this.lun2 = values[3];
        this.din1 = values[4];
        this.din2 = values[5];
    }
}

export class Menu {
    Day: string;
    Bf1: string;
    Bf1c: string;
    Bf2: string;
    Bf2c: string;
    Lun1: string;
    Lun1c: string;
    Lun2: string;
    Lun2c: string;
    Din1: string;
    Din1c: string;
    Din2: string;
    Din2c: string;

    constructor(values: Object = {}){
        Object.assign(this, values);
    }

    convToObj(): Object{
        var asd = [this.Bf1,this.Bf1c,this.Bf2,this.Bf2c,this.Lun1,this.Lun1c,this.Lun2,this.Lun2c,this.Din1,this.Din1c,this.Din2,this.Din2c];
        return asd;
    }
}

export class Code {
    username: string;
    code: string;
    constructor(values: Object = {}){
        Object.assign(this,values);
    }
}

export class Order{
    Date: string;
    Bf1: string;
    Bf2: string;
    Lun1: string;
    Lun2: string;
    Din1: string;
    Din2: string;
    constructor(values: Object = {}){
        Object.assign(this, values);
    }
    convToObj(): Object{
        var asd = [this.Bf1,this.Bf2,this.Lun1,this.Lun2,this.Din1,this.Din2];
        return asd;
    }
}

export class Codes{
    Bf1: string;
    Bf2: string;
    Lun1: string;
    Lun2: string;
    Din1: string;
    Din2: string;
    constructor(values: Object = {}){
        Object.assign(this, values);
    }
    convToObj(): Object{
        var asd = [this.Bf1,this.Bf2,this.Lun1,this.Lun2,this.Din1,this.Din2];
        return asd;
    }
}

export class FormMenuItems{
    items={};
    formItemsObject(data:string){
    var i=1;
    data.split(',').forEach(set => {
      var setSplit = set.split(':');
      if(setSplit[2]=='false'){
        this.items[i++]={name:setSplit[0], cost:+setSplit[1]};
      }
    });
    return this.items;
    }    
}

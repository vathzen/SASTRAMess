export class User {
   username: string;
   password: string;
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

    getBf1(){
        console.log(this.Bf1);
    }
}

export class Code {
    username: string;
    code: string;
    constructor(values: Object = {}){
        Object.assign(this,values);
    }
}

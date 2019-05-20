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
  bf1: string;
  bf2: string;
  lun1: string;
  lun2: string;
  din1: string;
  din2: string;
  constructor(values: Object = {}){
      Object.assign(this, values);
  }
}

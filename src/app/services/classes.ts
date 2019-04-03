export class User {
   username: number;
   password: number;
   exist: string;
   constructor(values: Object = {}) {
        Object.assign(this, values);
   }
}

export class Response {
    Status: string;
    constructor(values: Object = {}){
        Object.assign(this, values);
    }
}

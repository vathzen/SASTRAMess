import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { User,Response,Menu,Code,Codes } from './classes';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  baseUrl:string = "https://sastramess.herokuapp.com/";
  user = new User();
  coder = new Code();
  quants = new Codes();
  private menus = [];

  constructor(public httpClient : HttpClient) { }

  private handleError(err: HttpErrorResponse){
      console.error(err);
      return throwError('Something bad happened; please try again later.');
  }

  public userAuth(regnum,pwd): Observable<Response>{
      this.user.username = regnum;
      this.user.password = pwd;
      console.log(this.user);
      return this.httpClient.post(this.baseUrl +'users?user=0',this.user).pipe(
          map(response => {
              console.log(response);
              return new Response(response);
          }),
          catchError(this.handleError)
      );
  }

  public newUser(regnum,pwd,name): Observable<Response>{
      this.user.username = regnum;
      this.user.password = pwd;
      this.user.nickname = name;
      console.log(this.user);
      return this.httpClient.put(this.baseUrl + 'users',this.user).pipe(
        map(response => {
            console.log(response);
            return new Response(response);
        }),
        catchError(this.handleError)
      );
  }

  public getMenu(day): Observable<Menu>{
      return this.httpClient.get(this.baseUrl + 'menu' + '?day=' + day).pipe(
        map(val => {
          console.log(val);
          return new Menu(val);
        }),
        catchError(this.handleError));
  }

  public verCode(regnum,code): Observable<Response>{
      this.coder.username = regnum;
      this.coder.code = code;
      console.log(this.coder);
      return this.httpClient.post(this.baseUrl + 'codes',this.coder).pipe(
          map(response => {
              console.log(response);
              return new Response(response);
          }),
          catchError(this.handleError)
      );
  }

  public putOrder(order): Observable<Response>{
      return this.httpClient.post(this.baseUrl + 'orders',order).pipe(
          map(response => {
              console.log(response);
              return new Response(response);
          }),
          catchError(this.handleError)
      );
  }

  public getOrders(day,regno): Observable<Codes>{
      var url = this.baseUrl + 'orders?day='+ day.toString() + '&regno=' + regno;
      console.log(url);
      return this.httpClient.get(url).pipe(
          map(val => {
              console.log(val);
              return new Codes(val);
          }),
          catchError(this.handleError)
      );
  }

  public getStatus(): Observable<Response>{
      return this.httpClient.get(this.baseUrl).pipe(
          map(val => {
              return new Response(val);
          }),
          catchError(this.handleError)
      );
  }

  public getExist(reg): Observable<Response>{
      return this.httpClient.get(this.baseUrl + 'users?reg=' + reg).pipe(
        map(val => {
            return new Response(val);
        }),
        catchError(this.handleError)
      );
  }

  public changeNickname(regnum,nick): Observable<Response>{
      this.user.username = regnum;
      this.user.nickname = nick;
      console.log(this.user)
      return this.httpClient.post(this.baseUrl + 'users?user=2',this.user).pipe(
        map(val => {
            return new Response(val);
        }),
        catchError(this.handleError)
      );
  }
}

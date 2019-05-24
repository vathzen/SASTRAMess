import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { User,Response,Menu,Code } from './classes';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  baseUrl:string = "https://sastramess.herokuapp.com/";
  user = new User();
  coder = new Code();
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
      return this.httpClient.post(this.baseUrl +'users',this.user).pipe(
          map(response => {
              console.log(response);
              return new Response(response);
          }),
          catchError(this.handleError)
      );
  }

  public newUser(regnum,pwd): Observable<Response>{
      this.user.username = regnum;
      this.user.password = pwd;
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
}

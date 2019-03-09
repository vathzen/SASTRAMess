import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { UserDet } from './UserDet';

@Injectable({
  providedIn: 'root'
})

export class RestService {
  baseUrl:string = "localhost:8080";
  httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private httpClient: HttpClient) { }

  private extractData(res: Response){
      let body = res;
      return body || {};
  }

  private handleError(err: HttpErrorResponse){
      console.error(err);
      return throwError('Something bad happened; please try again later.');
  }

  public userAuth(user: UserDet): Observable<any>{
      return this.httpClient.post('http://localhost:1337/localhost:8080/users',user,this.httpOptions).pipe(
          map(this.extractData),
          catchError(this.handleError));
      }
}

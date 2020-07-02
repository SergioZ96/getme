import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

/*
 * Authentication HTTP Interceptor
 *    - used to add JWT in our Authorization header for every request that we make to access protected route on the backend server
 */

@Injectable({
  providedIn: 'root'
})
// Using Angular's HTTPInterceptor interface
export class InterceptorService  implements HttpInterceptor{

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwt');

    if(token) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization", `JWT ${token}`)
      });

      return next.handle(cloned);
    }
    else{
      return next.handle(req);
    }
  }
  
}

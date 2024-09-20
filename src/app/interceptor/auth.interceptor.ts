import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {AuthService} from "../domains/auth/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  static accessToken: string = '';
  refresh = false;

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.refresh = false;
    if (request.headers.has('Authorization')) {
      return next.handle(request);
    }
    const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${AuthInterceptor.accessToken}`
      }
    });

    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
      if ((err.status == 403 || err.status === 401 || err.status === 500) && !this.refresh && !request.url.includes('/auth/access-token') && !request.url.includes('/auth/token')) {
        this.refresh = true;
        return this.authService.refreshToken().pipe(
          switchMap((res: any) => {
            AuthInterceptor.accessToken = res.accessToken;
            document.cookie = `${res.refreshToken}; path=/`;
            return next.handle(request.clone({
              setHeaders: {
                Authorization: `Bearer ${AuthInterceptor.accessToken}`
              }
            }));
          })
        );
      }
      return throwError(() => err);
    }));
  }
}

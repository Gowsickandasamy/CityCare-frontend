import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError, of } from 'rxjs';
import { Router } from '@angular/router';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return now > expiry;
  } catch (e) {
    return true;
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const access_token = authService.getAccessToken();
  const refresh_token = authService.getRefreshToken();

  let modifiedReq = req;

  if (access_token && !isTokenExpired(access_token)) {
    modifiedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${access_token}` }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && refresh_token) {
        return authService.refreshToken(refresh_token).pipe(
          switchMap((response: any) => {
            authService.saveTokens(response.access, refresh_token);

            const newRequest = req.clone({
              setHeaders: { Authorization: `Bearer ${response.access}` }
            });

            return next(newRequest);
          }),
          catchError(err => {
            authService.logout();
            setTimeout(() => router.navigate(['/login']), 0);
            return throwError(() => err);
          })
        );
      }

      if (error.status === 401) {
        authService.logout();
        setTimeout(() => router.navigate(['/login']), 0)
        return throwError(() => error);
      }

      return throwError(() => error);
    })
  );
};

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasValidTokens());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(body: any): Observable<any> {
    const { email, password } = body;
    return this.http.post(`${this.apiUrl}/login/`, { email, password }).pipe(
      tap(() => {
        this.isLoggedInSubject.next(true);
      })
    );
  }

  register(userData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/token/refresh/`, { refresh: refreshToken });
  }

  saveTokens(access: string, refresh: string): void {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    this.isLoggedInSubject.next(true);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  logout(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getAccessToken();

    if (refreshToken && accessToken) {
      const headers = { Authorization: `Bearer ${accessToken}` };

      return this.http.post(`${this.apiUrl}/logout/`, { refresh: refreshToken }, { headers }).pipe(
        tap({
          next: () => this.clearSession(),
          error: (err) => {
            console.error("Logout Error:", err);
            this.clearSession();
          }
        })
      );
    } else {
      this.clearSession();
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }
  }

  getUserInfo():Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/user-info/`)
  }

  updateUserProfile(data:any):Observable<any>{
    return this.http.put(`${this.apiUrl}/user-info/`,data)
  }

  private fetchUserRole(): void {
    this.getUserInfo().subscribe({
      next: (user) => {
        this.userRoleSubject.next(user.role);
      },
      error: () => {
        this.userRoleSubject.next(null);
      }
    });
  }

  private clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isLoggedInSubject.next(false);
  }

  private hasValidTokens(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }

  changepassword(old_password:string, new_password:string, confirm_password:string):Observable<any>{4
    const body = { old_password, new_password, confirm_password };
    return this.http.post(`${this.apiUrl}/change-password/`, body)
  }

  isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return now > expiry;
  } catch (e) {
    return true;
  }
}

}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from '../footer/footer.component';
import { User } from '../../models/user';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    MatSidenavModule, 
    MatIconModule, 
    MatListModule, 
    RouterOutlet, 
    FooterComponent, 
    RouterLink, 
    MatToolbarModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  isLoggedIn$!: Observable<boolean>;
  userRole!: string | null;
  user!: User;
  isMobile = false;
  sidenavMode: 'side' | 'over' = 'side';
  opened = true;
  
  private destroy$ = new Subject<void>();
  private authService = inject(AuthService);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  
  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    
    // Handle responsive behavior
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.sidenavMode = 'over';
          this.opened = false;
        } else {
          this.sidenavMode = 'side';
          this.opened = true;
        }
      });
    
    this.authService.getUserInfo().subscribe(
      (res) => {
        this.user = res;
      },
      (err) => {
        console.log("Something went wrong");
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  closeSidenavOnMobile(): void {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error('Logout Failed:', err)
    });
  }

  isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }

  isUser(): boolean {
    return this.user?.role === 'USER';
  }
}
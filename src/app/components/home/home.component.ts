import { Component, OnInit,HostListener, ElementRef, Renderer2, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { FooterComponent } from '../footer/footer.component';
import { ButtonComponent } from '../../components-library/button/button.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { User } from '../../models/user';
import { throwIfEmpty } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatToolbarModule,MatSidenavModule, MatListModule, MatCardModule,ButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('1s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, AfterViewInit{
scrollToSection(arg0: string) {
throw new Error('Method not implemented.');
}

  user!:User;


  constructor(private authService:AuthService, private router:Router, private el: ElementRef, private renderer: Renderer2){

  }

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe({
      next: (userData) => {
        this.user = userData;
      },
      error: (err) => console.error('Error fetching user info:', err)
    });
  }
  
  
  @ViewChildren('fadeInElement') fadeInSections!: QueryList<ElementRef>;  
  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'is-visible');
          } else {
            this.renderer.removeClass(entry.target, 'is-visible');
          }
        });
      },
      { threshold: 0.1 } // Adjust threshold for when elements start appearing
    );

    this.fadeInSections.forEach((section) => {
      observer.observe(section.nativeElement);
    });
  }
  logout():void{
    this.authService.logout()
    this.router.navigate(['/login'])
  }

}

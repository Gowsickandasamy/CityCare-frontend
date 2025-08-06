import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ComplaintService } from '../../services/complaint.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-component',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user = {
    fullName: '',
    email: '',
    phone: '',
    role: ''
  };

  pendingCount: number = 0;
  resolvedCount: number = 0;
  totalCount: number = 0;
  constructor(
    private authService: AuthService,
    private complaintService: ComplaintService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadComplaintStats();
  }

  getResolutionRate(): number {
    if (this.totalCount === 0) return 0;
    return Math.round((this.resolvedCount / this.totalCount) * 100);
  }

  loadUserProfile() {
    this.authService.getUserInfo().subscribe({
      next: (res) => {
        this.user.fullName = res.username;
        this.user.email = res.email;
        this.user.phone = res.phone_number;
        this.user.role = res.role;
      },
      error: (err) => {
        console.error('Failed to fetch user profile:', err);
      }
    });
  }

  loadComplaintStats():void{
    this.complaintService.getComplaintStats().subscribe({
      next:(stats)=>{
        this.pendingCount = stats.pending;
        this.resolvedCount = stats.resolved;
        this.totalCount = stats.total;
      },
      error:(err)=>{
        console.error("Failed to fetch complaint stats", err)
      }
    })
  }
 
}

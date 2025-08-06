import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../components-library/button/button.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddOfficerService } from '../../services/add-officer.service';
import { OfficerModalComponent } from '../../components-library/officer-modal/officer-modal.component';
import { RouterLink } from '@angular/router';
import { Officer } from '../../models/officer';

@Component({
  selector: 'app-add-officer',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ButtonComponent, OfficerModalComponent, RouterLink],
  templateUrl: './add-officer.component.html',
  styleUrl: './add-officer.component.css'
})
export class AddOfficerComponent implements OnInit {

  OfficerForm!: FormGroup;
  showModal = false;
  errorMessage: string = '';
  officers: Officer[] = [];
  isLoadingStats = true;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService, 
    private officerService: AddOfficerService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadOfficersData();
  }

  private initializeForm(): void {
    this.OfficerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      area_of_control: ['', [Validators.required]]
    });
  }

  private loadOfficersData(): void {
    this.isLoadingStats = true;
    this.officerService.getOfficers().subscribe({
      next: (officers) => {
        this.officers = officers;
        this.isLoadingStats = false;
      },
      error: (error) => {
        console.error('Error loading officers data:', error);
        this.isLoadingStats = false;
        // Don't show error toast for stats loading as it's not critical
      }
    });
  }

  // Calculate total number of officers
  getTotalOfficers(): number {
    return this.officers.length;
  }

  // Calculate average rating of all officers
  getAverageRating(): string {
    if (this.officers.length === 0) return '0.0';
    
    const sum = this.officers.reduce((total, officer) => {
      return total + (officer.average_rating || 0);
    }, 0);
    
    return (sum / this.officers.length).toFixed(1);
  }

  // Calculate number of unique areas
  getActiveAreas(): number {
    if (this.officers.length === 0) return 0;
    
    const uniqueAreas = new Set();
    this.officers.forEach(officer => {
      if (officer.area_of_control && officer.area_of_control.trim()) {
        uniqueAreas.add(officer.area_of_control.trim().toLowerCase());
      }
    });
    
    return uniqueAreas.size;
  }

  // Calculate today's reports (if you have reports data)
  getTodaysReports(): number {
    // If you have reports data in officers or separate service, calculate here
    // For now, returning a calculated value based on officers
    return this.officers.reduce((total, officer) => {
      return total + (officer.reports_count || 0);
    }, 0);
  }

  // Get stats array for template
  getStats() {
    return [
      { 
        label: 'Total Officers', 
        value: this.isLoadingStats ? '...' : this.getTotalOfficers().toString(), 
        icon: '👥',
        loading: this.isLoadingStats
      },
      { 
        label: 'Avg. Rating', 
        value: this.isLoadingStats ? '...' : this.getAverageRating(), 
        icon: '⭐',
        loading: this.isLoadingStats
      },
      { 
        label: 'Active Areas', 
        value: this.isLoadingStats ? '...' : this.getActiveAreas().toString(), 
        icon: '📍',
        loading: this.isLoadingStats
      }
    ];
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.errorMessage = '';
  }

  submitOfficerForm(): void {
    if (this.OfficerForm.valid) {
      this.officerService.addOfficer(this.OfficerForm.value).subscribe({
        next: (res) => {
          this.showModal = false;
          this.toastr.success("Officer added successfully!");
          this.OfficerForm.reset();
          // Reload officers data to update stats
          this.loadOfficersData();
        },
        error: (err) => {
          this.toastr.error("Failed to add officer. Please try again.");
          this.errorMessage = "Something went wrong. Please try again.";
        }
      });
    } else {
      this.errorMessage = "Please fill in all required fields correctly.";
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.OfficerForm.controls).forEach(key => {
      this.OfficerForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.OfficerForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} is too short`;
    }
    return '';
  }

  // Additional helper methods for enhanced stats
  getTopPerformingArea(): string {
    if (this.officers.length === 0) return 'N/A';
    
    const areaRatings: { [key: string]: { total: number, count: number } } = {};
    
    this.officers.forEach(officer => {
      const area = officer.area_of_control?.trim();
      const rating = officer.average_rating || 0;
      
      if (area) {
        if (!areaRatings[area]) {
          areaRatings[area] = { total: 0, count: 0 };
        }
        areaRatings[area].total += rating;
        areaRatings[area].count += 1;
      }
    });
    
    let topArea = 'N/A';
    let highestAverage = 0;
    
    Object.keys(areaRatings).forEach(area => {
      const average = areaRatings[area].total / areaRatings[area].count;
      if (average > highestAverage) {
        highestAverage = average;
        topArea = area;
      }
    });
    
    return topArea;
  }

  getOfficersWithHighRating(): number {
    return this.officers.filter(officer => (officer.average_rating || 0) >= 4).length;
  }
}
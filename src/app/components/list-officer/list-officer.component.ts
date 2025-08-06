import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Officer } from '../../models/officer';
import { AddOfficerService } from '../../services/add-officer.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-officer',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './list-officer.component.html',
  styleUrl: './list-officer.component.css'
})
export class ListOfficerComponent implements OnInit {
  officers: Officer[] = [];
  filteredOfficers: Officer[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedOfficer: Officer | null = null;
  showDeleteModal: boolean = false;
  showViewModal: boolean = false;
  
  // For pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private officerService: AddOfficerService, 
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getOfficers();
  }

  getOfficers() {
    this.isLoading = true;
    this.officerService.getOfficers().subscribe({
      next: (res) => {
        this.officers = res;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error("Failed to load officers. Please try again.");
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      this.filteredOfficers = this.officers.filter(officer => 
        officer.username.toLowerCase().includes(term) || 
        officer.email.toLowerCase().includes(term) || 
        officer.area_of_control.toLowerCase().includes(term)
      );
    } else {
      this.filteredOfficers = [...this.officers];
    }

    // Apply sorting
    if (this.sortColumn) {
      this.filteredOfficers.sort((a, b) => {
        const aValue = a[this.sortColumn as keyof Officer];
        const bValue = b[this.sortColumn as keyof Officer];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return this.sortDirection === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        } else {
          const numA = Number(aValue);
          const numB = Number(bValue);
          return this.sortDirection === 'asc' ? numA - numB : numB - numA;
        }
      });
    }

    // Calculate total pages
    this.totalPages = Math.ceil(this.filteredOfficers.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  // Calculate average rating
  getAverageRating(): string {
    if (this.officers.length === 0) return '0.0';
    
    const sum = this.officers.reduce((total, officer) => {
      return total + (officer.average_rating || 0);
    }, 0);

    
    return (sum / this.officers.length).toFixed(1);
  }

  // Get unique areas count
  getUniqueAreasCount(): number {
    const uniqueAreas = new Set();
    this.officers.forEach(officer => {
      if (officer.area_of_control) {
        uniqueAreas.add(officer.area_of_control);
      }
    });
    return uniqueAreas.size;
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  clearSearch() {
    this.searchTerm = '';
    this.onSearch();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'fa-sort';
    }
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  confirmDelete(officer: Officer) {
    this.selectedOfficer = officer;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.selectedOfficer = null;
  }

  proceedDelete() {
    if (this.selectedOfficer) {
      this.deleteOfficer(this.selectedOfficer.userId);
      this.showDeleteModal = false;
      this.selectedOfficer = null;
    }
  }

  viewOfficer(officer: Officer) {
    this.selectedOfficer = officer;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedOfficer = null;
  }

  deleteOfficer(id: number) {
    this.officerService.confirmBox(id).subscribe({
      next: (isDeleted) => {
        if (isDeleted) {
          this.toastr.success("Officer deleted successfully");
          this.getOfficers();
        }
      },
      error: (error) => {
        this.toastr.error("Failed to delete officer. Please try again.");
      }
    });
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push('half');
    }
    
    // Add empty stars
    while (stars.length < 5) {
      stars.push('empty');
    }
    
    return stars;
  }

  get paginatedOfficers(): Officer[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOfficers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get pages(): number[] {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max pages to show
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end page numbers
      let startPage = Math.max(2, this.currentPage - 1);
      let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      // Adjust if we're near the beginning
      if (this.currentPage <= 3) {
        endPage = 4;
      }
      
      // Adjust if we're near the end
      if (this.currentPage >= this.totalPages - 2) {
        startPage = this.totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < this.totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }
      
      // Always show last page
      pages.push(this.totalPages);
    }
    
    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
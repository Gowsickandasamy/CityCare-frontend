import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Officer } from '../models/officer';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AddOfficerService {

  private apiUrl = "http://127.0.0.1:8000/officer"

  constructor(private http: HttpClient) { }

  addOfficer(body:any):Observable<any>{
    const { username, email, phone_number, area_of_control } = body
    return this.http.post(`${this.apiUrl}/create/`, { username, email, phone_number, area_of_control })
  }

  getOfficers():Observable<Officer[]>{
    return this.http.get<Officer[]>(`${this.apiUrl}/getOfficer/`)
  }

  deleteOfficer(id:number):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/deleteOfficer/${id}/`)
  }

  confirmBox(id: number): Observable<boolean> {
    return new Observable(observer => {
      Swal.fire({
        title: 'Are you sure want to remove?',
        text: 'You will not be able to recover this file!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteOfficer(id).subscribe({
            next: () => {
              Swal.fire('Deleted!', 'The officer has been deleted.', 'success');
              observer.next(true);
              observer.complete();
            },
            error: (error) => {
              Swal.fire('Error!', 'An error occurred while deleting the officer.', 'error');
              observer.error(error);
            }
          });
        } else {
          Swal.fire('Cancelled', 'The officer is safe :)', 'error');
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
}

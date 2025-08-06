import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Complaint } from '../models/complaint';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private baseUrl = 'http://127.0.0.1:8000';
  private complaintUrl = `${this.baseUrl}/complaints`;
  private officerUrl = `${this.baseUrl}/officer`;

  constructor(private http:HttpClient) { }

  createComplaint(formData: FormData): Observable<Complaint> {
    return this.http.post<Complaint>(`${this.complaintUrl}/create/`, formData);
  }

  get_complaint():Observable<Complaint[]>{
    return this.http.get<Complaint[]>(`${this.complaintUrl}/list/`)
  }

  get_complaintById(id:number):Observable<Complaint>{
    return this.http.get<Complaint>(`${this.complaintUrl}/${id}/`)
  }

  edit_complaint(formData: FormData): Observable<Complaint> {
  const id = formData.get('id');
  return this.http.put<Complaint>(`${this.complaintUrl}/${id}/edit/`, formData);
}

  get_current_complaint():Observable<Complaint[]>{
    return this.http.get<Complaint[]>(`${this.complaintUrl}/current-complaints/`)
  }

  change_status(body: { id: number; status: string }): Observable<any> {
    return this.http.put(`${this.complaintUrl}/${body.id}/status/`, { status: body.status });
  }

  delete_complaint(id:number):Observable<any>{
    return this.http.delete(`${this.complaintUrl}/${id}/delete/`)
  }

  add_review(body: { id: number; rating: number; comment:string}):Observable<any>{
    return this.http.post(`${this.officerUrl}/${body.id}/rating/`,{rating:body.rating, comment:body.comment})
  }

  get_detail_complaint(id:number):Observable<Complaint>{
    return this.http.get<Complaint>(`${this.complaintUrl}/${id}/detail/`).pipe(map(res => res.complaint)) 
  }

  getComplaintStats():Observable<any>{
    return this.http.get(`${this.complaintUrl}/stats/`)
  }

}

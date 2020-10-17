import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Request, Response, NextFunction } from 'express';
import { Students } from '../model/students-model';
export type MiddlewareFn = (req: Request, res: Response, next: NextFunction) => void;


@Injectable({
  providedIn: 'root'
})
export class StudentsApiService {

  
  constructor(private http: HttpClient) { }

  getStudent(id){
      console.log(id)
      return this.http.get(`${environment.apiUrl}/students/${id}`);
  }
  getAll() {
      return this.http.get<any[]>(`${environment.apiUrl}/students`)
  }

  addStudent(student) {
      return this.http.post(`${environment.apiUrl}/students/`, student);
    
  }

  getReport(className, dateRange) {
    return this.http.get(`${environment.apiUrl}/students/students-report-by-date-range/${className}/${dateRange}`);
}

  delete(id) {
      return this.http.delete(`${environment.apiUrl}/students/${id}`);
  }

  updateStudent(id) {
    return this.http.put(`${environment.apiUrl}/students/`, id);
  }

}

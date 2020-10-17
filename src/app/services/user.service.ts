import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Request, Response, NextFunction } from 'express';
export type MiddlewareFn = (req: Request, res: Response, next: NextFunction) => void;

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient) { }

    getUser(id){
        console.log(id)
        return this.http.get(`${environment.apiUrl}/users/${id}`);
    }
    getAll() {
        return this.http.get<any[]>(`${environment.apiUrl}/users`);
    }

    register(user) {
        console.log('USER LOGGING');
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    delete(id) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }



}

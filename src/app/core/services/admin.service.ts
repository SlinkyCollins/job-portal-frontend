import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiServiceService } from './api-service.service';

export const API = {
    GET_ALL_USERS: 'dashboard/admin/get_users',
    DELETE_USER: 'dashboard/admin/delete_user',
    GET_STATS: 'dashboard/admin/get_stats',
};

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    constructor(
        private http: HttpClient,
        private apiService: ApiServiceService) { }

    fullUrl(endpoint: string) {
        return `${this.apiService.apiUrl}/${endpoint}`;
    }

    // User Management
    getAllUsers(): Observable<any> {
        return this.http.get(this.fullUrl(API.GET_ALL_USERS));
    }

    deleteUser(userId: number): Observable<any> {
        return this.http.post(this.fullUrl(API.DELETE_USER), { user_id: userId });
    }        

    suspendUser(userId: number): Observable<any> {
        return this.http.post(`${this.fullUrl}/dashboard/admin/users/suspend`, { userId });
    }

    // Job Management
    getAllJobs(): Observable<any> {
        return this.http.get(`${this.fullUrl}/dashboard/admin/jobs`);
    }

    deleteJob(jobId: number): Observable<any> {
        return this.http.delete(`${this.fullUrl}/dashboard/admin/jobs/${jobId}`);
    }

    // Category Management
    getAllCategories(): Observable<any> {
        return this.http.get(`${this.fullUrl}/dashboard/admin/categories`);
    }

    createCategory(category: any): Observable<any> {
        return this.http.post(`${this.fullUrl}/dashboard/admin/categories`, category);
    }

    deleteCategory(categoryId: number): Observable<any> {
        return this.http.delete(`${this.fullUrl}/dashboard/admin/categories/${categoryId}`);
    }

    // Overview Stats
    getDashboardStats(): Observable<any> {
        return this.http.get(this.fullUrl(API.GET_STATS));
    }
}

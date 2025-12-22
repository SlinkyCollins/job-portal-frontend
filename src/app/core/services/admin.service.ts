import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiServiceService } from './api-service.service';

export const API = {
    GET_ALL_USERS: 'dashboard/admin/get_users',
    DELETE_USER: 'dashboard/admin/delete_user',
    GET_STATS: 'dashboard/admin/get_stats',
    GET_ALL_JOBS: 'dashboard/admin/get_jobs',
    DELETE_JOB: 'dashboard/admin/delete_job',
    GET_CATEGORIES: 'dashboard/admin/get_categories',
    ADD_CATEGORY: 'dashboard/admin/add_category',
    DELETE_CATEGORY: 'dashboard/admin/delete_category',
    UPDATE_PASSWORD: 'dashboard/admin/update_password'
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

    // Job Management
    getAllJobs(): Observable<any> {
        return this.http.get(this.fullUrl(API.GET_ALL_JOBS));
    }

    deleteJob(jobId: number): Observable<any> {
        return this.http.post(this.fullUrl(API.DELETE_JOB), { job_id: jobId });
    }

    // Category Management (FIXED)
    getAllCategories(): Observable<any> {
        return this.http.get(this.fullUrl(API.GET_CATEGORIES));
    }

    createCategory(name: string): Observable<any> {
        return this.http.post(this.fullUrl(API.ADD_CATEGORY), { name });
    }

    deleteCategory(categoryId: number): Observable<any> {
        return this.http.post(this.fullUrl(API.DELETE_CATEGORY), { id: categoryId });
    }

    // Overview Stats
    getDashboardStats(): Observable<any> {
        return this.http.get(this.fullUrl(API.GET_STATS));
    }

    updatePassword(currentPassword: string, newPassword: string): Observable<any> {
        return this.http.post(this.fullUrl(API.UPDATE_PASSWORD), {
            current_password: currentPassword,
            new_password: newPassword
        });
    }
}
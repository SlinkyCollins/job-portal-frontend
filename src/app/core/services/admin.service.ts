import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiServiceService } from './api-service.service';

export const API = {
    getAllUsers: 'dashboard/admin/get_users',
    suspendUser: 'dashboard/admin/suspend_user',
    deleteUser: 'dashboard/admin/delete_user',
    getStats: 'dashboard/admin/get_stats',
    getAllJobs: 'dashboard/admin/get_jobs',
    updateJobStatus: 'dashboard/admin/update_job_status',
    deleteJob: 'dashboard/admin/delete_job',
    getCategories: 'dashboard/admin/get_categories',
    addCategory: 'dashboard/admin/add_category',
    updateCategory: 'dashboard/admin/update_category',
    deleteCategory: 'dashboard/admin/delete_category',
    updatePassword: 'dashboard/admin/update_password'
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
        return this.http.get(this.fullUrl(API.getAllUsers));
    }

    toggleUserSuspension(userId: number, action: string): Observable<any> {
        return this.http.put(this.fullUrl(API.suspendUser), { user_id: userId, action });
    }

    deleteUser(userId: number): Observable<any> {
        return this.http.post(this.fullUrl(API.deleteUser), { user_id: userId });
    }

    // Job Management
    getAllJobs(params?: any): Observable<any> {
        return this.http.get(this.fullUrl(API.getAllJobs), { params });
    }

    updateJobStatus(jobId: number, status: string): Observable<any> {
        return this.http.put(this.fullUrl(API.updateJobStatus), { job_id: jobId, status });
    }

    deleteJob(jobId: number): Observable<any> {
        return this.http.post(this.fullUrl(API.deleteJob), { job_id: jobId });
    }

    // Category Management (FIXED)
    createCategory(name: string): Observable<any> {
        return this.http.post(this.fullUrl(API.addCategory), { name });
    }

    getAllCategories(): Observable<any> {
        return this.http.get(this.fullUrl(API.getCategories));
    }

    updateCategory(id: number, name: string): Observable<any> {
        return this.http.put(this.fullUrl(API.updateCategory), { id, name });
    }

    deleteCategory(categoryId: number): Observable<any> {
        return this.http.post(this.fullUrl(API.deleteCategory), { id: categoryId });
    }

    // Overview Stats
    getDashboardStats(): Observable<any> {
        return this.http.get(this.fullUrl(API.getStats));
    }

    updatePassword(currentPassword: string, newPassword: string): Observable<any> {
        return this.http.post(this.fullUrl(API.updatePassword), {
            current_password: currentPassword,
            new_password: newPassword
        });
    }
}
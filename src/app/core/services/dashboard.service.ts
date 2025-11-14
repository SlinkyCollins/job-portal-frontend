import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiServiceService } from './api-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    private apiService: ApiServiceService
  ) { }

  // Get dashboard stats for job seeker
  getSeekerStats(): Observable<any> {
    return this.http.get(`${this.apiService.apiUrl}/dashboard/seeker_stats.php`);
  }

  // Get recent applications for job seeker
  getRecentApplications(): Observable<any> {
    return this.http.get(`${this.apiService.apiUrl}/dashboard/recent_applications.php`);
  }

  retractApplication(applicationId: number): Observable<any> {
    return this.http.post(`${this.apiService.apiUrl}/dashboard/retract_application.php`, { applicationId });
  }

  // Update user profile
  updateProfile(profileData: any): Observable<any> {
    return this.http.post(`${this.apiService.apiUrl}/dashboard/update_profile.php`, profileData);
  }

  // Get saved jobs
  getSavedJobs(): Observable<any> {
    return this.http.get(`${this.apiService.apiUrl}/dashboard/saved_jobs.php`);
  }

  // Get job alerts
  getJobAlerts(): Observable<any> {
    return this.http.get(`${this.apiService.apiUrl}/dashboard/job_alerts.php`);
  }

  // Create job alert
  createJobAlert(alertData: any): Observable<any> {
    return this.http.post(`${this.apiService.apiUrl}/dashboard/create_job_alert.php`, alertData);
  }

  // Delete job alert
  deleteJobAlert(alertId: number): Observable<any> {
    return this.http.post(`${this.apiService.apiUrl}/dashboard/delete_job_alert.php`, { alertId });
  }

  // Change password
  changePassword(passwordData: any): Observable<any> {
    return this.http.post(`${this.apiService.apiUrl}/dashboard/change_password.php`, passwordData);
  }

  // Delete account
  deleteAccount(): Observable<any> {
    return this.http.post(`${this.apiService.apiUrl}/dashboard/delete_account.php`, {});
  }
}
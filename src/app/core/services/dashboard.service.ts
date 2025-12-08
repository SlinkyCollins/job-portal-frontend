import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiServiceService } from './api-service.service';
import { Observable } from 'rxjs';
export const API = {
  SEEKER_STATS: 'dashboard/seeker_stats',
  RECENT_APPLICATIONS: 'dashboard/recent_applications',
  RETRACT_APPLICATION: 'dashboard/retract_application',
  UPDATE_PROFILE: 'dashboard/update_profile',
  UPLOAD_PROFILE_PHOTO: 'dashboard/upload_profile_photo',
  DELETE_PROFILE_PHOTO: 'dashboard/delete_profile_photo',
  SAVED_JOBS: 'dashboard/saved_jobs',
  DELETE_ACCOUNT: 'dashboard/delete_account'
};

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    private apiService: ApiServiceService
  ) { }

  fullUrl(endpoint: string) {
    return `${this.apiService.apiUrl}/${endpoint}`;
  }

  // Get dashboard stats for job seeker
  getSeekerStats(): Observable<any> {
    return this.http.get(this.fullUrl(API.SEEKER_STATS));
  }

  // Get recent applications for job seeker
  getRecentApplications(): Observable<any> {
    return this.http.get(this.fullUrl(API.RECENT_APPLICATIONS));
  }

  retractApplication(applicationId: number): Observable<any> {
    return this.http.post(this.fullUrl(API.RETRACT_APPLICATION), { applicationId });
  }

  // Update user profile
  updateProfile(profileData: any): Observable<any> {
    return this.http.post(this.fullUrl(API.UPDATE_PROFILE), profileData);
  }

  // Upload profile photo
  uploadProfilePhoto(photoData: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', photoData);
    return this.http.post(this.fullUrl(API.UPLOAD_PROFILE_PHOTO), formData);
  }

  // Delete profile photo
  deleteProfilePhoto(): Observable<any> {
    return this.http.post(this.fullUrl(API.DELETE_PROFILE_PHOTO), {});
  }

  // Get saved jobs
  getSavedJobs(): Observable<any> {
    return this.http.get(this.fullUrl(API.SAVED_JOBS));
  }

  // Delete account
  deleteAccount(param: any): Observable<any> {
    // You must send the body matching the PHP expectation
    return this.http.post(this.fullUrl(API.DELETE_ACCOUNT), param);
  }
}
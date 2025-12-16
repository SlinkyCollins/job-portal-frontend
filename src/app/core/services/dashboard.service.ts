import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiServiceService } from './api-service.service';
import { Observable } from 'rxjs';
export const API = {
  SEEKER_STATS: 'dashboard/seeker/seeker_stats',
  RECENT_APPLICATIONS: 'dashboard/seeker/recent_applications',
  ALL_APPLICATIONS: 'dashboard/seeker/all_applications',
  RETRACT_APPLICATION: 'dashboard/seeker/retract_application',
  SAVED_JOBS: 'dashboard/seeker/saved_jobs',
  UPDATE_PROFILE: 'dashboard/shared/update_profile',
  UPLOAD_PROFILE_PHOTO: 'dashboard/shared/upload_profile_photo',
  DELETE_PROFILE_PHOTO: 'dashboard/shared/delete_profile_photo',
  DELETE_ACCOUNT: 'dashboard/shared/delete_account',

  // Employer Endpoints
  EMPLOYER_STATS: 'dashboard/employer/stats',
  POST_JOB: 'dashboard/employer/post_job',
  GET_EMPLOYER_JOBS: 'dashboard/employer/get_employer_jobs',
  GET_COMPANY_PROFILE: 'dashboard/employer/get_company_profile',
  SAVE_COMPANY_PROFILE: 'dashboard/employer/save_company_profile',
  DELETE_JOB: 'dashboard/employer/delete_job',
  GET_JOB_DETAILS: 'dashboard/employer/get_job_details',
  UPDATE_JOB: 'dashboard/employer/update_job',
  GET_APPLICATIONS: 'dashboard/employer/get_applications',
  UPDATE_APPLICATION_STATUS: 'dashboard/employer/update_application_status'
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

  // Get all applications for job seeker
  getAllApplications(): Observable<any> {
    return this.http.get(this.fullUrl(API.ALL_APPLICATIONS));
  }

  retractApplication(applicationId: number): Observable<any> {
    return this.http.post(this.fullUrl(API.RETRACT_APPLICATION), { applicationId });
  }



  // Employer Methods
  getEmployerStats(): Observable<any> {
    return this.http.get(this.fullUrl(API.EMPLOYER_STATS));
  }

  postJob(jobData: any): Observable<any> {
    return this.http.post(this.fullUrl(API.POST_JOB), jobData);
  }

  getEmployerJobs(): Observable<any> {
    return this.http.get(this.fullUrl(API.GET_EMPLOYER_JOBS));
  }

  deleteJob(jobId: number): Observable<any> {
    return this.http.post(this.fullUrl(API.DELETE_JOB), { job_id: jobId });
  }

  getJobDetails(jobId: number): Observable<any> {
    return this.http.get(`${this.fullUrl(API.GET_JOB_DETAILS)}?job_id=${jobId}`);
  }

  updateJob(jobData: any): Observable<any> {
    return this.http.post(this.fullUrl(API.UPDATE_JOB), jobData);
  }

  getCompanyProfile(): Observable<any> {
    return this.http.get(this.fullUrl(API.GET_COMPANY_PROFILE));
  }

  saveCompanyProfile(data: any): Observable<any> {
    return this.http.post(this.fullUrl(API.SAVE_COMPANY_PROFILE), data);
  }

  getApplications(): Observable<any> {
    return this.http.get(this.fullUrl(API.GET_APPLICATIONS));
  }

  updateApplicationStatus(appId: number, status: string): Observable<any> {
    return this.http.post(this.fullUrl(API.UPDATE_APPLICATION_STATUS), {
      application_id: appId,
      status: status
    });
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
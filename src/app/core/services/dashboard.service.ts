import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiServiceService } from './api-service.service';
import { Observable } from 'rxjs';
export const API = {
  // Seeker Endpoints
  SEEKER_STATS: 'dashboard/seeker/seeker_stats',
  RECENT_APPLICATIONS: 'dashboard/seeker/recent_applications',
  ALL_APPLICATIONS: 'dashboard/seeker/all_applications',
  RETRACT_APPLICATION: 'dashboard/seeker/retract_application',
  SAVED_JOBS: 'dashboard/seeker/saved_jobs',
  UPDATE_PROFILE: 'dashboard/seeker/update_profile',
  SAVEDJOBS: 'dashboard/seeker/saved_jobs',
  SEEKERPROFILE: 'dashboard/seeker/seeker_profile',
  UPLOAD_CV: 'dashboard/seeker/upload_cv',
  DELETE_CV: 'dashboard/seeker/delete_cv',
  UPDATERESUME: 'dashboard/seeker/update_resume',

  // Shared Endpoints
  UPLOAD_PROFILE_PHOTO: 'dashboard/shared/upload_profile_photo',
  DELETE_PROFILE_PHOTO: 'dashboard/shared/delete_profile_photo',
  DELETE_ACCOUNT: 'dashboard/shared/delete_account',
  GET_SETTINGS: 'dashboard/shared/get_settings',
  LINK_SOCIAL: 'dashboard/shared/link_social',

  // Employer Endpoints
  GET_DASHBOARD_DATA: 'dashboard/employer/get_dashboard_data',
  GET_TAGS: 'dashboard/employer/get_tags',
  POST_JOB: 'dashboard/employer/post_job',
  GET_EMPLOYER_JOBS: 'dashboard/employer/get_employer_jobs',
  GET_EMPLOYER_PROFILE: 'dashboard/employer/get_profile',
  UPDATE_EMPLOYER_PROFILE: 'dashboard/employer/update_profile',
  GET_COMPANY_PROFILE: 'dashboard/employer/get_company_profile',
  SAVE_COMPANY_PROFILE: 'dashboard/employer/save_company_profile',
  DELETE_JOB: 'dashboard/employer/delete_job',
  CLOSE_JOB: 'dashboard/employer/close_job',
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


  // Seeker Methods

  getSavedJobs(params: any = {}) {
    return this.http.get(this.fullUrl(API.SAVEDJOBS), { params });
  }

  getSeekerProfile() {
    return this.http.get(this.fullUrl(API.SEEKERPROFILE));
  }

  // Update seeker profile
  updateProfile(profileData: any): Observable<any> {
    return this.http.post(this.fullUrl(API.UPDATE_PROFILE), profileData);
  }

  uploadCV(file: File, filename: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);  // Send to backend

    return this.http.post(this.fullUrl(API.UPLOAD_CV), formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteCV(): Observable<any> {
    return this.http.post(this.fullUrl(API.DELETE_CV), {});
  }

  updateResume(data: any): Observable<any> {
    return this.http.post(this.fullUrl(API.UPDATERESUME), data);
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

  getEmployerDashboardData(): Observable<any> {
    return this.http.get(this.fullUrl(API.GET_DASHBOARD_DATA));
  }

  getTags(): Observable<any> {
    return this.http.get(this.fullUrl(API.GET_TAGS));
  }

  postJob(jobData: any): Observable<any> {
    return this.http.post(this.fullUrl(API.POST_JOB), jobData);
  }

  getEmployerJobs(params: any = {}): Observable<any> {
    return this.http.get(this.fullUrl(API.GET_EMPLOYER_JOBS), { params });
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

  closeJob(jobId: number): Observable<any> {
    return this.http.post(this.fullUrl(API.CLOSE_JOB), { job_id: jobId });
  }

  getEmployerProfile(): Observable<any> {
    return this.http.get(this.fullUrl(API.GET_EMPLOYER_PROFILE));
  }

  updateEmployerProfile(data: any): Observable<any> {
    return this.http.post(this.fullUrl(API.UPDATE_EMPLOYER_PROFILE), data);
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


  // Shared Methods

  // Get Settings
  getSettings(): Observable<any> {
    return this.http.get(this.fullUrl(API.GET_SETTINGS));
  }

  // In dashboard.service.ts, keep linkSocial with both parameters
  linkSocial(providerId: string, socialUid?: string): Observable<any> {
    const body: any = { provider_id: providerId };
    if (socialUid) body.social_uid = socialUid;
    return this.http.post(this.fullUrl(API.LINK_SOCIAL), body);
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

  //  Delete Account
  deleteAccount(param: any): Observable<any> {
    // You must send the body matching the PHP expectation
    return this.http.post(this.fullUrl(API.DELETE_ACCOUNT), param);
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public profileSubject = new BehaviorSubject<{ photoURL: string; firstname: string }>({ photoURL: '', firstname: '' });
  profile$ = this.profileSubject.asObservable();

  public employerProfileSubject = new BehaviorSubject<{ photoURL: string; firstname: string }>({ photoURL: '', firstname: '' });
  employerProfile$ = this.employerProfileSubject.asObservable();

  // NEW: Completion Percentage Subject
  private completionSubject = new BehaviorSubject<number>(0);
  public completion$ = this.completionSubject.asObservable();

  updateProfile(photoURL: string, firstname: string) {
    this.profileSubject.next({ photoURL, firstname });
  }

  updateEmployerProfile(photoURL: string, firstname: string) {
    this.employerProfileSubject.next({ photoURL, firstname });
  }

  // NEW: Centralized Calculation Logic
  updateCompletionScore(profile: any) {
    let score = 0;
    const totalCriteria = 11;

    // 1. Profile Section
    if (profile.fullname) score++;
    if (profile.phone) score++;
    if (profile.address) score++;
    if (profile.country) score++;
    if (profile.bio) score++;
    if (profile.profile_pic_url) score++;

    // 2. Resume Section
    if (profile.cv_url) score++;
    if (profile.overview) score++;
    if (profile.experience) score++;

    // 3. Arrays (Education & Skills)
    try {
      const edu = typeof profile.education === 'string' ? JSON.parse(profile.education) : profile.education;
      if (Array.isArray(edu) && edu.length > 0) score++;
    } catch (e) { console.error('Error parsing education', e); }

    try {
      const skills = typeof profile.resume_skills === 'string' ? JSON.parse(profile.resume_skills) : profile.resume_skills;
      if (Array.isArray(skills) && skills.length > 0) score++;
    } catch (e) { console.error('Error parsing skills', e); }

    const percentage = Math.round((score / totalCriteria) * 100);

    // Emit the new value
    this.completionSubject.next(percentage);
  }
}

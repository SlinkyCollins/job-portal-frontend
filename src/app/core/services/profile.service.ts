import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileSubject = new BehaviorSubject<{ photoURL: string; firstname: string }>({ photoURL: '', firstname: '' });
  profile$ = this.profileSubject.asObservable();

  updateProfile(photoURL: string, firstname: string) {
    this.profileSubject.next({ photoURL, firstname });
  }
}

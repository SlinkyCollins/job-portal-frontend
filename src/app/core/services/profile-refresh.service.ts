import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileRefreshService {
  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  // New subject for resetting linking state
  private resetLinkingSubject = new Subject<void>();
  resetLinking$ = this.resetLinkingSubject.asObservable();

  triggerRefresh() {
    console.log('Triggering profile refresh');
    this.refreshSubject.next();
  }

  triggerResetLinking() {
    console.log('Triggering linking state reset');
    this.resetLinkingSubject.next();
  }
}

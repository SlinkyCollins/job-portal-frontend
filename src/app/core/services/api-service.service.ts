import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor() { }

  apiUrl = 'http://localhost/JobPortal/login.php';
}

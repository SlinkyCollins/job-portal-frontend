import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor() { }

  apiUrl = environment.apiUrl || 'https://job-portal-backend-rua3.onrender.com';
}
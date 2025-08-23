import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor() { }

  apiUrl = 'https://job-portal-backend-rua3.onrender.com';
}
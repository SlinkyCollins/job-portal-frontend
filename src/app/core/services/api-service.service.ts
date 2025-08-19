import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor() { }

  apiUrl = 'https://36b8d26bb8c2.ngrok-free.app/JobPortal';
}

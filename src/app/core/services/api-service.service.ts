import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor() { }

  apiUrl = 'https://open-honeybee-endlessly.ngrok-free.app/JobPortal';
}
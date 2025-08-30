import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor() { }

  apiUrl = 'https://jobnet.vercel.app/api';
}
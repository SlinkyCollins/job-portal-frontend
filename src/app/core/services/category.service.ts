import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
export const API = {
  GET_CATEGORIES: 'jobs/categories'
};

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesCache: any[] | null = null;
  fullUrl(endpoint: string) {
    return `${this.apiService.apiUrl}/${endpoint}`;
  }

  constructor(private http: HttpClient, private apiService: ApiServiceService) {}

  getCategories(): Observable<any[]> {
    if (this.categoriesCache) {
      // Return cached categories immediately
      return of(this.categoriesCache);
    }

    return this.http.get<{ status: boolean; categories: any[] }>(
      this.fullUrl(API.GET_CATEGORIES)
    ).pipe(
      tap((res) => {
        if (res.status) {
          this.categoriesCache = res.categories;
        }
      }),
      map((res) => res.categories),
      catchError((error) => {
        console.error('Error fetching categories:', error);
        return of([]); // Return empty array on error
      })
    );
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesCache: any[] | null = null;

  constructor(private http: HttpClient, private apiService: ApiServiceService) {}

  getCategories(): Observable<any[]> {
    if (this.categoriesCache) {
      // Return cached categories immediately
      return of(this.categoriesCache);
    }

    return this.http.get<{ status: boolean; categories: any[] }>(
      `${this.apiService.apiUrl}/get_categories.php`
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
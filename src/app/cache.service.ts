import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache: { [key: string]: any } = {};

  get<T>(key: string): T | null {
    return this.cache[key] || null;
  }

  set<T>(key: string, value: T): void {
    this.cache[key] = value;
  }

  clear(key: string): void {
    delete this.cache[key];
  }
}

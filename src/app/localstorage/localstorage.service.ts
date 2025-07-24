import { Injectable } from '@angular/core';

/**
 * Service for interacting with the browser's localStorage API.
 * Provides CRUD methods.
 * Handles serialization and deserialization of complex data types.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  /**
   * Saves data to localStorage with the specified key.
   * Handles serialization of complex objects including Date objects.
   *
   * @param key - The key under which to store the data
   * @param data - The data to store
   */
  setItem<T>(key: string, data: T): void {
    try {
      // Convert data to JSON string for storage
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Retrieves data from localStorage by key.
   * Handles deserialization of complex objects including Date objects.
   *
   * @param key - The key of the data to retrieve
   * @returns The retrieved data, or null if not found
   */
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);

      if (!item) {
        return null;
      }

      // Parse the JSON string back to an object
      const parsedData = JSON.parse(item, (key, value) => {
        if (typeof value === 'string' &&
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z$/.test(value)) {
          return new Date(value);
        }
        return value;
      });

      return parsedData as T;
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return null;
    }
  }

  /**
   * Removes data from localStorage by key.
   *
   * @param key - The key of the data to remove
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Clears all data from localStorage.
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

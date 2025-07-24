// Import required modules
import {BehaviorSubject, Observable} from 'rxjs';
import {Expense} from './expense.model';
import {Injectable, OnDestroy} from '@angular/core';
import {LocalstorageService} from '../localstorage/localstorage.service';

/**
 * Service responsible for managing expense data throughout the application.
 * Provides CRUD methods for adding, retrieving, updating, and deleting expense items.
 * Use RxJS BehaviorSubject to maintain and share the current state of expenses.
 * Persists expenses to localStorage to maintain data between page refreshes.
 */
@Injectable({
  providedIn: 'root',
})
export class ExpenseService implements OnDestroy {
  /**
   * Key used for storing expenses in localStorage
   * @private
   */
  private readonly STORAGE_KEY = 'expenses';

  /**
   * BehaviorSubject that stores and emits the current list of expenses.
   * Initialized with data from localStorage if available, otherwise empty array.
   * @private
   */
  private expenseList$: BehaviorSubject<Expense[]>;

  /**
   * Constructor that injects the LocalstorageService and initializes the expense list
   * from localStorage if available.
   *
   * @param localStorageService - Service for interacting with localStorage
   * @see LocalstorageService
   */
  constructor(private localStorageService: LocalstorageService) {
    // Load expenses from localStorage or initialize with an empty array
    const savedExpenses: Expense[] = this.localStorageService.getItem<Expense[]>(this.STORAGE_KEY) || [];
    this.expenseList$ = new BehaviorSubject<Expense[]>(savedExpenses);
  }

  /**
   * Cleanup method called when the service is destroyed.
   * Ensures any pending operations are completed.
   */
  ngOnDestroy(): void {
    this.expenseList$.complete();
  }

  /**
   * Adds a new expense item to the expense list and persists to localStorage.
   * @param newItem - The expense item to be added
   * @see LocalstorageService
   */
  addItem(newItem: Expense): void {
    const currentItems: Expense[] = this.expenseList$.getValue();
    const updatedItems: Expense[] = [...currentItems, newItem];
    this.expenseList$.next(updatedItems);
    this.saveToLocalStorage(updatedItems);
  }

  /**
   * Retrieves the current list of expense items as an Observable.
   * @returns An Observable of the expense items array
   */
  getItems(): Observable<Expense[]> {
    return this.expenseList$.asObservable();
  }

  /**
   * Updates an existing expense item in the list and persists to localStorage.
   * Replaces the item with matching ID with the updated item.
   * @param updatedItem - The expense item with updated values
   * @see LocalstorageService
   */
  updateItem(updatedItem: Expense): void {
    const currentItems: Expense[] = this.expenseList$.getValue();
    const updatedItems: Expense[] = currentItems.flatMap(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this.expenseList$.next(updatedItems);
    this.saveToLocalStorage(updatedItems);
  }

  /**
   * Deletes an expense item from the list by its ID and persists to localStorage.
   * @param itemId - The ID of the expense item to be deleted
   * @see LocalstorageService
   */
  deleteItem(itemId: string): void {
    const currentItems: Expense[] = this.expenseList$.getValue();
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.expenseList$.next(updatedItems);
    this.saveToLocalStorage(updatedItems);
  }

  /**
   * Save the current expense list to localStorage service.
   * @param expenses - The expense list to save
   * @private
   * @see LocalstorageService
   */
  private saveToLocalStorage(expenses: Expense[]): void {
    this.localStorageService.setItem(this.STORAGE_KEY, expenses);
  }
}

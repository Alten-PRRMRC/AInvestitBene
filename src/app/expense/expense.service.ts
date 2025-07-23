// Import required modules
import {BehaviorSubject, Observable} from 'rxjs';
import {Expense} from './expense.model';
import {Injectable} from '@angular/core';

/**
 * Service responsible for managing expense data throughout the application.
 * Provides CRUD methods for adding, retrieving, updating, and deleting expense items.
 * Uses RxJS BehaviorSubject to maintain and share the current state of expenses.
 */
@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  /**
   * BehaviorSubject that stores and emits the current list of expenses.
   * Initialized as an empty array.
   * @private
   */
  private expenseList$: BehaviorSubject<Expense[]> = new BehaviorSubject<Expense[]>([]);

  /**
   * Adds a new expense item to the expense list.
   * @param newItem - The expense item to be added
   */
  addItem(newItem: Expense): void {
    const currentItems: Expense[] = this.expenseList$.getValue();
    this.expenseList$.next([...currentItems, newItem]);
  }

  /**
   * Retrieves the current list of expense items as an Observable.
   * @returns An Observable of the expense items array
   */
  getItems(): Observable<Expense[]> {
    return this.expenseList$.asObservable();
  }

  /**
   * Updates an existing expense item in the list.
   * Replaces the item with matching ID with the updated item.
   * @param updatedItem - The expense item with updated values
   */
  updateItem(updatedItem: Expense): void {
    const currentItems: Expense[] = this.expenseList$.getValue();
    const updatedItems: Expense[] = currentItems.flatMap(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this.expenseList$.next(updatedItems);
  }

  /**
   * Deletes an expense item from the list by its ID.
   * @param itemId - The ID of the expense item to be deleted
   */
  deleteItem(itemId: string): void {
    const currentItems: Expense[] = this.expenseList$.getValue();
    this.expenseList$.next(currentItems.filter(item => item.id !== itemId));
  }
}

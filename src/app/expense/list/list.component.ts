// Import required modules

import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { BehaviorSubject, combineLatest, map, Observable } from "rxjs";
import { Expense } from "../expense.model";
import { ExpenseService } from "../expense.service";
import { CategoryPipe } from "./category.pipe";
import { ListSwitchComponent } from './switch/list-switch.component';
import { Dict as DictExpense } from './dict.model';
import { ListSearchComponent } from './search-field/list-search.component';
import { AppHighlightBig } from '../../app/expense/list/app-highlight-big';

/**
 * Component that shows a table of users transactions
 */
@Component({
  selector: "expense-list",
  imports: [CommonModule, RouterLink, CategoryPipe, ListSwitchComponent, ListSearchComponent, AppHighlightBig],
  templateUrl: "./list.component.html",
  styleUrl: "./list.component.css",
})
export class ListComponent implements OnInit {

  /**
   * Initialized injecting ExpenseService service
   * @private
   * @see ExpenseService
   */
  private expenseService: ExpenseService = inject(ExpenseService);

  protected readonly Object = Object; // Used to check if expenses$ is not a dict empty

  /**
   * BehaviorSubject that stores checkbox values from ListSwitchComponent.
   * If is true is annually, false is monthly
   * @see ListSwitchComponent
   */
  checkboxValue$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * List of table title based on Expense
   * @see Expense
   */
  titleTable: string[] = ["Description", "Amount", "Category", "Date", ""];

  /**
   * Observable of a dictionary Expense[]
   * @see DictExpense
   * @see Expense
   */
  expenses$!: Observable<DictExpense<Expense[]>>;

  /**
   * Observable of dictionary keys
   * @see DictExpense
   */
  expensesKey$!: Observable<string[]>;

  /**
   * BehaviorSubject that stores search field values from ListSearchComponent.
   * @see ListSearchComponent
   */
  searchQuery$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  ngOnInit(): void {
    let expenseItems$: BehaviorSubject<Expense[]> = this.expenseService.getItems();
    let filteredExpenses$: Observable<Expense[]> = combineLatest([ // Create a new observable filtered combining
        this.searchQuery$, // An BehaviorSubject of string from the list-search component.
        expenseItems$,  // An BehaviorSubject of Expense from ExpenseService
      ]).pipe( // Each element of this Observable will be
        map(([query, expenses]: [string, Expense[]]): Expense[] => { // filtered based on description of Expense.
          if (query.length === 0) { // If query is empty, return all expenses
            return expenses
          }
          // Filter Expense based on description like query, both not case-sensitive.
          let filtered: Expense[] = expenses.filter((e: Expense): boolean =>
              e.description.toLowerCase().replace(/\s/g, "").includes(query)
            );
          return filtered.length === 0 ? expenses : filtered; // Return filtered or original expenses if none match
        })
    );

    this.expenses$ = combineLatest([ // To create a new observable dictionary we combine the follow observables.
      filteredExpenses$, // An Observable of filtered Expense list.
      this.checkboxValue$ // An BehaviorSubject of booleans from the list-switch checkbox.
      ]).pipe( // Each element of this observable will be
      map(([expenses, checkbox]: [Expense[], boolean]): DictExpense<Expense[]> => { // transformed in a dictionary.
        const obj: DictExpense<Expense[]> = {}; // Initialize an empty dictionary.
        for(let i: number = 0; i < expenses.length; i++) { // For each Expense[] items
          let key: string = checkbox ? // the key will be, if checkbox
            expenses[i].date.getFullYear().toString() : // is true, it's Expense's date annual.
            expenses[i].date.toLocaleString('default', { month: 'long' }); // Otherwise, it's Expense's date month
          if (!obj[key]) { // If the current key does not exist in the dictionary
            obj[key] = []; // initialize an empty array
          }
          obj[key].push(expenses[i]); // and adds the current Expense to the Expense's array of dictionary
        }
        return obj; // Return populated Expense's dictionary
      }),
    );

    // Now, we need an observable dictionary keys of observable Expense's dictionary to determinate the order to show it.
    this.expensesKey$ = this.expenses$.pipe( // Each element of Expense's dictionary will be
      map((obj: DictExpense<Expense[]>): string[] => { // transformed in a dictionary keys.
        const keys: string[] = Object.keys(obj); // Get all the keys from Expense's dictionary and sort them
        return this.checkboxValue$.value ? // If checkbox
          keys.sort((a: string, b: string): number =>
            parseInt(a) - parseInt(b)) : // is true, annually sorted decrescent.
            keys.sort() // Otherwise false, monthly sorted alphabetically.
      })
    )
  }

  /**
   * Delete from the table an expense item by its ID calling `deleteItem()` of the ExpenseService.
   * @param id - The ID of the expense item to be deleted
   * @see ExpenseService
   */
  deleteExpense(id: string): void {
    this.expenseService.deleteItem(id);
  }

  /**
   * Change the value of the checkboxValue$ to the current status of the checkbox
   * @param value - Boolean of the checkbox
   * @see ListSwitchComponent
   * @see checkboxValue$
   */
  onCheckboxChange(value: boolean): void {
    this.checkboxValue$.next(value);
  }

  /**
   * Change the value of the searchQuery$ to the current value of the search field
   * @param value - String, query user's input
   * @see ListSearchComponent
   * @see searchQuery$
   */
  onSearchUpdate(query: string): void{
    this.searchQuery$.next(query);
  }
}

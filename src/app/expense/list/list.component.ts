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
import { AppHighlightBig } from './app-highlight-big';
import { ListService } from './list.service';

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
   * Initialized injecting ListService service
   * @protected
   * @see ListService
   */
  protected listService: ListService = inject(ListService);

  /**
   * Initialized injecting ExpenseService service
   * @protected
   * @see ExpenseService
   */
  protected expenseService: ExpenseService = inject(ExpenseService);

  /** Used to check if expenses$ is not a dict empty
   * @protected
   */
  protected readonly Object = Object;

  /**
   * List of table title based on Expense
   * @see Expense
   */
  titleTable: string[] = ["Description", "Amount", "Category", "Date", ""];

  /**
   * Observable of a dictionary Expense
   * @see DictExpense
   * @see Expense
   */
  expenses$: Observable<DictExpense<Expense[]>> = new Observable();

  /**
   * Observable of dictionary keys
   * @see DictExpense
   */
  expensesKey$: Observable<string[]> = new Observable();

  /**
   * BehaviorSubject that stores search field values from ListSearchComponent.
   * @see ListSearchComponent
   */
  searchQuery$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * BehaviorSubject that stores checkbox values from ListSwitchComponent.
   * If is true is annually, false is monthly
   * @see ListSwitchComponent
   */
  checkboxValue$ = new BehaviorSubject<boolean>(false);

	ngOnInit(): void {
		const expenseItems$: BehaviorSubject<Expense[]> =
			this.expenseService.expenseList$;

    this.expenses$ = this.listService.getExpenses$(expenseItems$, this.searchQuery$, this.checkboxValue$);
    this.expensesKey$ = this.listService.getExpensesKey$(expenseItems$, this.checkboxValue$);
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

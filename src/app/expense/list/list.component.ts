// Import required modules

import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { Expense } from "../expense.model";
import { ExpenseService } from "../expense.service";
import { CategoryPipe } from "./category.pipe";
import { ListSwitchComponent } from './switch/list-switch.component';

/**
 * Component that shows a table of users transactions
 */
@Component({
  selector: "expense-list",
  imports: [CommonModule, RouterLink, CategoryPipe, ListSwitchComponent],
  templateUrl: "./list.component.html",
  styleUrl: "./list.component.css",
})
export class ListComponent implements OnInit {

  /**
   * BehaviorSubject that stores and emits checkbox values from ListSwitchComponent.
   * If is true is annually, false is monthly
   * @see ListSwitchComponent
   */
  checkboxValue$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Initialized injecting ExpenseService service
   * @private
   * @see ExpenseService
   */
  private expenseService: ExpenseService = inject(ExpenseService);

	/**
	 * List of table title based on Expense
	 * @see Expense
	 */
	titleTable: string[] = ["Description", "Amount", "Category", "Date", ""];

	/**
	 * Observable of a list Expense
	 */
	public expenses$!: Observable<Expense[]>;

	ngOnInit(): void {
		this.expenses$ = this.expenseService.getItems();
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
}

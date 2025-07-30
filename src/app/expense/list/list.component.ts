// Import required modules
import { Component, inject, type OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { ExpenseService } from "../expense.service";
import { Expense } from "../expense.model";
import { Observable } from "rxjs";

/**
 * Component that shows a table of users transactions
 */
@Component({
	selector: "expense-list",
	imports: [CommonModule, RouterLink],
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
}

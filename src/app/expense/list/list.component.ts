// Import required modules

import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { CategoryPipe } from "./category.pipe";
import { ListSwitchComponent } from "./switch/list-switch.component";
import { ListSearchComponent } from "./search-field/list-search.component";
import { AppHighlightBig } from "../app-highlight-big";
import { ListService } from "./list.service";

/**
 * Component that shows a table of users transactions
 */
@Component({
	selector: "expense-list",
	imports: [
		CommonModule,
		RouterLink,
		CategoryPipe,
		ListSwitchComponent,
		ListSearchComponent,
		AppHighlightBig,
	],
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

	/** Used to check if expenses$ is not a dict empty
	 * @protected
	 */
	protected readonly Object = Object;

	/**
	 * List of table title based on Expense
	 * @see Expense
	 */
	titleTable: string[] = ["Description", "Amount", "Category", "Date", "", ""];

	/**
	 * BehaviorSubject that stores search field values from ListSearchComponent.
	 * @see ListSearchComponent
	 */
	searchQuery$: BehaviorSubject<string> = new BehaviorSubject<string>("");

	/**
	 * BehaviorSubject that stores checkbox values from ListSwitchComponent.
	 * If is true is annually, false is monthly
	 * @see ListSwitchComponent
	 */
	checkboxValue$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	ngOnInit(): void {
		this.listService.initialize(this.searchQuery$, this.checkboxValue$);
	}

	/**
	 * Wrapper of deleteExpense of ListService
	 * @param id - The ID of the expense item to be deleted
   * @see ListService
	 * @see ExpenseService
	 */
	deleteExpense(id: string): void {
		this.listService.deleteExpense(id);
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
	onSearchUpdate(query: string): void {
		this.searchQuery$.next(query);
	}
}

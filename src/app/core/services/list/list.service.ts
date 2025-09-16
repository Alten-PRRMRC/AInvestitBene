// Import required modules

import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, switchMap } from "rxjs";
import { Dict } from "@shared/models/dict.model";
import { Expense } from "@shared/models/expense.model";
import { ExpenseService } from "@core/services";

/**
 * Service responsible for managing streams of Expense's observable for ListComponent.
 * @see ListComponent
 * @see ExpenseService
 */
@Injectable({
	providedIn: "root",
})
export class ListService {
	/**
	 * Initialized injecting ExpenseService service
	 * @protected
	 * @see ExpenseService
	 */
	protected expenseService: ExpenseService = inject(ExpenseService);

	/**
	 * Observable of a dictionary filtered Expense
	 * @see DictExpense
	 * @see Expense
	 */
	filteredExpenses$: Observable<Dict<Expense[]>> = new Observable();

	/**
	 * Observable of dictionary keys
	 * @see Dict
	 */
	expensesFilteredKey$: Observable<string[]> = new Observable();

	/**
	 * Observable of a Expense
	 * @see Expense
	 */
	expenseItems$: BehaviorSubject<Expense[]> = this.expenseService.expenseList$;

	/**
	 * Filters a list of expenses based on a search query.
	 *
	 * Removes whitespace and performs a case-insensitive match against the expense description.
	 * If no matches are found, return the original list.
	 *
	 * @param query - The search string used to filter expenses.
	 * @param expenses - The array of Expense objects to filter.
	 * @returns A filtered array of Expense objects, or the original array if no matches are found.
	 */
	private filterFn: (query: string, expenses: Expense[]) => Expense[] = (
		query: string,
		expenses: Expense[],
	): Expense[] => {
		if (query.length === 0) {
			return expenses;
		}
		let filtered: Expense[] = expenses.filter((e: Expense): boolean =>
			e.description.toLowerCase().replace(/\s/g, "").includes(query),
		);
		return filtered.length === 0 ? expenses : filtered;
	};

	/**
	 * Initializes the expense observables
	 *
	 * @param queryFilter - A BehaviorSubject stream containing user's filter.
	 * @param checkboxValue$ - A BehaviorSubject stream indicating whether to group expenses annually (true) or monthly (false).
	 *
	 * @remarks
	 * This method sets up `expenses$` as a filtered and grouped observable of expenses,
	 * and `expensesKey$` as a derived observable of keys (e.g., months or years) based on the grouping.
	 */
	initialize(
		queryFilter: BehaviorSubject<string>,
		checkboxValue$: BehaviorSubject<boolean>,
	): void {
		this.filteredExpenses$ = this.expenseService.getExpenses$(
			this.expenseItems$,
			queryFilter,
			checkboxValue$,
			this.filterFn,
		);

		this.expensesFilteredKey$ = this.filteredExpenses$.pipe(
			map((dictExpense: Dict<Expense[]>): Expense[] => {
				const allExpenses: Expense[] = Object.values(dictExpense).flat();
				return allExpenses;
			}),
			switchMap(
				(allExpenses: Expense[]): Observable<string[]> =>
					this.expenseService.getExpensesKey$(
						new BehaviorSubject(allExpenses),
						checkboxValue$,
					),
			),
		);
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

// Import required modules

import { Injectable } from "@angular/core";
import {
	BehaviorSubject,
	combineLatest,
	map,
	Observable,
	OperatorFunction,
} from "rxjs";
import { Dict, Dict as DictExpense } from "./dict.model";
import { Expense } from "../expense.model";

/**
 * Service responsible for managing streams of Expense's observable for Expense's components.
 * @see ListComponent
 * @see StatsComponent
 */
@Injectable({
	providedIn: "root",
})
export class ListService {
	/**
	 * Returns an observable of Expenses that are filtered by a query and then grouped by month or year.
	 * @param expenseItems$ - BehaviorSubject stream of all expenses.
	 * @param query$ - BehaviorSubject stream of the user's filter query.
	 * @param checkboxValue$ - BehaviorSubject stream indicating if the view is annual (true) or monthly (false).
	 * @param filterFn - Function to filter expenses based on the query.
	 * @returns An observable of a dictionary of grouped Expenses.
	 * @see Expense
	 * @see ListSearchComponent
	 * @see ListSwitchComponent
	 */
	getExpenses$(
		expenseItems$: BehaviorSubject<Expense[]>,
		query$: BehaviorSubject<string>,
		checkboxValue$: BehaviorSubject<boolean>,
		filterFn: (query: string, expenses: Expense[]) => Expense[],
	): Observable<Dict<Expense[]>> {
		const filteredExpenses$ = combineLatest([query$, expenseItems$]).pipe(
			map(([query, expenses]) => {
				const filtered = filterFn(query, expenses);
				return filtered;
			}),
		);

		return combineLatest([filteredExpenses$, checkboxValue$]).pipe(
			this.list_map(),
		);
	}

	/**
	 * Returns a sorted observable of keys for the observable dictionary Expenses.
	 * @param expenseItems$ - BehaviorSubject stream of all expenses.
	 * @param checkboxValue$ - BehaviorSubject stream indicating if the view is annual (true) or monthly (false).
	 * @returns An observable of a dictionary of grouped Expenses.
	 * @see Expense
	 * @see ListSwitchComponent
	 */
	getExpensesKey$(
		expenseItems$: BehaviorSubject<Expense[]>,
		checkboxValue$: BehaviorSubject<boolean>,
	): Observable<string[]> {
		let expenses$: Observable<DictExpense<Expense[]>> = combineLatest([
			// To create a new observable dictionary we combine the follow observables.
			expenseItems$, // An Observable of filtered Expense list.
			checkboxValue$, // An BehaviorSubject of booleans from the list-switch checkbox.
		]).pipe(this.list_map());
		return expenses$.pipe(
			// Each element of Expense's dictionary will be
			map((obj: DictExpense<Expense[]>): string[] => {
				// transformed in a dictionary keys.
				const keys: string[] = Object.keys(obj); // Get all the keys from Expense's dictionary and sort them
				return checkboxValue$.value
					? // If checkbox
						keys.sort(
							(a: string, b: string): number => parseInt(b) - parseInt(a),
						)
					: // is true, annually sorted decrescent.
						keys.sort(); // Otherwise false, monthly sorted alphabetically.
			}),
		);
	}

	/**
	 * Returns an observable dictionary of the sum of Expense imports, grouped by key of month or annual.
	 * @param groupedExpenses$ - Observable stream of dictionary of Expense.
	 * @returns An observable of a dictionary of grouped imports Expenses.
	 * @see Expense
	 * @see ListSwitchComponent
	 */
	getExpensesTotalImport$(
		groupedExpenses$: Observable<DictExpense<Expense[]>>,
	): Observable<Dict<number>> {
		return groupedExpenses$.pipe(
			map((groupedExpenses: Dict<Expense[]>): Dict<number> => {
				const totals: Dict<number> = {};
				for (const key in groupedExpenses) {
					totals[key] = groupedExpenses[key].reduce(
						(tot: number, expense: Expense): number => tot + expense.import,
						0,
					);
				}
				return totals;
			}),
		);
	}

	/**
	 * Wrapper of map OperatorFunction for Expenses list and booleans
	 * @return An observable of a dictionary of grouped imports Expenses.
	 * @private
	 */
	private list_map(): OperatorFunction<
		[Expense[], boolean],
		DictExpense<Expense[]>
	> {
		// Each element of this observable will be
		return map(
			([expenses, checkbox]: [Expense[], boolean]): DictExpense<Expense[]> => {
				// transformed in a dictionary.
				const obj: DictExpense<Expense[]> = {}; // Initialize an empty dictionary.
				for (let i: number = 0; i < expenses.length; i++) {
					// For each Expense[] items
					let key: string = this.getGroupKey(expenses[i], checkbox);
					if (!obj[key]) {
						// If the current key does not exist in the dictionary
						obj[key] = []; // initialize an empty array
					}
					obj[key].push(expenses[i]); // and adds the current Expense to the Expense's array of dictionary
				}
				return obj; // Return populated Expense's dictionary
			},
		);
	}

	/**
	 * Return a string key for grouping an Expense.
	 * The key is determined by the Expense's date and the desired grouping type (annual or monthly).
	 * @param expense - The expense item from which to extract the date.
	 * @param checkbox - A boolean that determines the grouping logic.
	 * @return Key for observable of a dictionary Expense
	 * @private
	 */
	private getGroupKey(expense: Expense, checkbox: boolean): string {
		return checkbox // the key will be, if checkbox
			? expense.date
					.getFullYear()
					.toString() // is true, it's Expense's date annual.
			: expense.date.toLocaleString("default", { month: "long" }); // Otherwise, it's Expense's date month
	}
}

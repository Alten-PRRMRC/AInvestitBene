// Import required modules

import { inject, Injectable, OnDestroy } from "@angular/core";
import {
	BehaviorSubject,
	combineLatest,
	map,
	Observable,
	OperatorFunction,
} from "rxjs";
import { LocalstorageService } from "@core/services/localstorage/localstorage.service";
import {
	Expense,
	ExpenseCategory,
	ArrExpenseCategory,
} from "@shared/models/expense.model";
import { Dict } from "@shared/models/dict.model";

/**
 * Service responsible for managing expense data throughout the application.
 * Provides CRUD methods for adding, retrieving, updating, and deleting expense items.
 * Use RxJS BehaviorSubject to maintain and share the current state of expenses.
 * Persists expenses to localStorage to maintain data between page refreshes.
 */
@Injectable({
	providedIn: "root",
})
export class ExpenseService implements OnDestroy {
	/**
	 * Key used for storing expenses in localStorage
	 * @private
	 */
	private readonly STORAGE_KEY = "expenses";

	/**
	 * BehaviorSubject that stores and emits the current list of expenses.
	 * Initialized with data from localStorage if available, otherwise empty array.
	 * @private
	 */
	private _expenseList$: BehaviorSubject<Expense[]>;

	/**
	 * Injects the LocalstorageService
	 * @see LocalstorageService
	 */
	private _localStorageService: LocalstorageService =
		inject(LocalstorageService);

	constructor() {
		// Load expenses from localStorage or initialize with an empty array
		const savedExpenses: Expense[] =
			this._localStorageService.getItem<Expense[]>(this.STORAGE_KEY) || [];
		this._expenseList$ = new BehaviorSubject<Expense[]>(savedExpenses);
	}

	/**
	 * Adds a new expense item to the expense list and persists to localStorage.
	 * @param newItem - The expense item to be added
	 * @see LocalstorageService
	 */
	addItem(newItem: Expense): void {
		const currentItems: Expense[] = this._expenseList$.getValue();
		const updatedItems: Expense[] = [...currentItems, newItem];
		this._expenseList$.next(updatedItems);
		this.saveToLocalStorage(updatedItems);
	}

	/**
	 * Retrieves the current list of expense items as BehaviorSubject.
	 * @returns A BehaviorSubject of the expense items array
	 */
	get expenseList$(): BehaviorSubject<Expense[]> {
		return this._expenseList$;
	}

	/**
	 * Updates an existing expense item in the list and persists to localStorage.
	 * Replaces the item with matching ID with the updated item.
	 * @param updatedItem - The expense item with updated values
	 * @see LocalstorageService
	 */
	updateItem(updatedItem: Expense): void {
		const currentItems: Expense[] = this._expenseList$.getValue();
		const updatedItems: Expense[] = currentItems.flatMap((item) =>
			item.id === updatedItem.id ? updatedItem : item,
		);
		this._expenseList$.next(updatedItems);
		this.saveToLocalStorage(updatedItems);
	}

	/**
	 * Deletes an expense item from the list by its ID and persists to localStorage.
	 * @param itemId - The ID of the expense item to be deleted
	 * @see LocalstorageService
	 */
	deleteItem(itemId: string): void {
		const currentItems: Expense[] = this._expenseList$.getValue();
		const updatedItems = currentItems.filter((item) => item.id !== itemId);
		this._expenseList$.next(updatedItems);
		this.saveToLocalStorage(updatedItems);
	}

	/**
	 * Search expense by id and return it if find it
	 * @param id - id of the expenses.
	 */
	getById(id: string | undefined): Expense | undefined {
		return id
			? this._expenseList$.getValue().find((e) => e.id === id)
			: undefined;
	}

	/**
	 * Provides the list of available expense categories.
	 *
	 * @returns An array of `ExpenseCategory` values.
	 */
	get categories(): ExpenseCategory[] {
		return ArrExpenseCategory;
	}

	/**
	 * Returns an observable of Expenses that are filtered by a query and then grouped by month or year.
	 * @param expenseItems$ - BehaviorSubject stream of all expenses.
	 * @param query$ - BehaviorSubject stream of the user's filter query.
	 * @param checkboxValue$ - BehaviorSubject stream indicating if the view is annual (true) or monthly (false).
	 * @param filterFn - Function to filter expenses based on the query.
	 * @returns An observable of a dictionary of grouped Expenses.
	 * @see Expense
	 * @see ListSearchComponent
	 * @see StatsSelectorComponent
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
		let expenses$: Observable<Dict<Expense[]>> = combineLatest([
			// To create a new observable dictionary we combine the follow observables.
			expenseItems$, // An Observable of filtered Expense list.
			checkboxValue$, // An BehaviorSubject of booleans from the list-switch checkbox.
		]).pipe(this.list_map());
		return expenses$.pipe(
			// Each element of Expense's dictionary will be
			map((obj: Dict<Expense[]>): string[] => {
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
		groupedExpenses$: Observable<Dict<Expense[]>>,
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
	private list_map(): OperatorFunction<[Expense[], boolean], Dict<Expense[]>> {
		// Each element of this observable will be
		return map(
			([expenses, checkbox]: [Expense[], boolean]): Dict<Expense[]> => {
				// transformed in a dictionary.
				const obj: Dict<Expense[]> = {}; // Initialize an empty dictionary.
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

	/**
	 * Save the current expense list to localStorage service.
	 * @param expenses - The expense list to save
	 * @private
	 * @see LocalstorageService
	 */
	private saveToLocalStorage(expenses: Expense[]): void {
		this._localStorageService.setItem(this.STORAGE_KEY, expenses);
	}

	/**
	 * Cleanup method called when the service is destroyed.
	 * Ensures any pending operations are completed.
	 */
	ngOnDestroy(): void {
		this._expenseList$.complete();
	}
}

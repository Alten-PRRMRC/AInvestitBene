import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, switchMap } from "rxjs";
import { Expense, Dict } from "@shared/models";
import { ExpenseService } from "@core/services";

@Injectable({
	providedIn: "root",
})
export class StatsService {
	/**
	 * Observable of a dictionary filtered Expense
	 * @see DictExpense
	 * @see Expense
	 */
	expensesFiltered$: Observable<Dict<Expense[]>> = new Observable();

	/**
	 * Observable of dictionary keys
	 * @see DictExpense
	 */
	expensesFilteredKey$: Observable<string[]> = new Observable();

	/**
	 * Initialized injecting ExpenseService service
	 * @protected
	 * @see ExpenseService
	 */
	expenseService: ExpenseService = inject(ExpenseService);

	/**
	 * Observable of an Expense
	 * @see Expense
	 */
	expenseItems$: BehaviorSubject<Expense[]> = this.expenseService.expenseList$;

	/**
	 * Observable of a dictionary of grouped imports Expenses
	 * @see DictStats
	 */
	expensesTotal$: Observable<Dict<number>> = new Observable();

	/**
	 * Filters a list of expenses based on category selector.
	 *
	 * @param query - The category value used to filter expenses.
	 * @param expenses - The array of Expense objects to filter.
	 * @returns A filtered array of Expense objects, or the original array if no matches are found.
	 */
	private filterFn: (query: string, expenses: Expense[]) => Expense[] = (
		query: string,
		expenses: Expense[],
	): Expense[] =>
		query === "all" ? expenses : expenses.filter((e) => e.category === query);

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
		this.expensesFiltered$ = this.expenseService.getExpenses$(
			this.expenseItems$,
			queryFilter,
			checkboxValue$,
			this.filterFn,
		);

		this.expensesFilteredKey$ = this.expensesFiltered$.pipe(
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

		this.expensesTotal$ = this.expenseService.getExpensesTotalImport$(
			this.expensesFiltered$,
		);
	}
}

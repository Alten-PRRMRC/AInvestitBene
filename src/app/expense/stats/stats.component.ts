import {
	Component,
	inject,
	OnInit,
	signal,
	WritableSignal,
} from "@angular/core";
import { ListSwitchComponent } from "../list/switch/list-switch.component";
import { BehaviorSubject, Observable } from "rxjs";
import { Dict as DictStats } from "../list/dict.model";
import { AppHighlightBig } from "../app-highlight-big";
import { AsyncPipe, TitleCasePipe } from "@angular/common";
import { ListService } from "../list/list.service";
import { ExpenseService } from "../expense.service";
import { Expense } from "../expense.model";
import { StatsSelectorComponent } from "./category-selector/stats-selector.component";

@Component({
	selector: "expense-stats",
	imports: [
		ListSwitchComponent,
		AppHighlightBig,
		AsyncPipe,
		TitleCasePipe,
		StatsSelectorComponent,
	],
	templateUrl: "./stats.component.html",
	styleUrl: "./stats.component.css",
})
export class StatsComponent implements OnInit {
	/** Used to check if expensesTotal$ is not a dict empty
	 * @protected
	 */
	protected readonly Object = Object;

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

	readonly subtitle: WritableSignal<string> = signal("Expense List");

	/**
	 * Observable of dictionary keys
	 * @see DictStats
	 */
	expensesKey$: Observable<string[]> = new Observable();

	/**
	 * Observable of a dictionary of grouped imports Expenses
	 * @see DictStats
	 */
	expensesTotal$: Observable<DictStats<number>> = new Observable();

	/**
	 * BehaviorSubject that stores checkbox values from ListSwitchComponent.
	 * If is true is annually, false is monthly
	 * @see ListSwitchComponent
	 */
	checkboxValue$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false,
	);

	/**
	 * BehaviorSubject that store selector values from StatsSelectorComponent.
	 * @see StatsSelectorComponent
	 */
	categoryValue$: BehaviorSubject<string> = new BehaviorSubject<string>("all");

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

	ngOnInit(): void {
		const expenseItems$: BehaviorSubject<Expense[]> =
			this.expenseService.expenseList$;
		const expenses$ = this.listService.getExpenses$(
			expenseItems$,
			this.categoryValue$,
			this.checkboxValue$,
			this.filterFn,
		);

		let filteredDict$: BehaviorSubject<Expense[]> = new BehaviorSubject<
			Expense[]
		>([]);

		expenses$.subscribe((dictExpense: DictStats<Expense[]>): void => {
			const allExpenses: Expense[] = [];

			Object.keys(dictExpense).forEach((key: string): void => {
				allExpenses.push(...dictExpense[key]);
			});

			filteredDict$.next(allExpenses);
		});

		this.expensesKey$ = this.listService.getExpensesKey$(
			filteredDict$,
			this.checkboxValue$,
		);
		this.expensesTotal$ = this.listService.getExpensesTotalImport$(expenses$);
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
	 * Change the value of the categoryValue$ to the current status of the selector
	 * @param value - String selected of the selector
	 * @see StatsSelectorComponent
	 * @see categoryValue$
	 */
	onCategoryChange(value: string): void {
		this.categoryValue$.next(value);
	}
}

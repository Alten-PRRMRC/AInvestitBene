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
import { AppHighlightBig } from "../list/app-highlight-big";
import { AsyncPipe, CurrencyPipe, TitleCasePipe } from "@angular/common";
import { ListService } from "../list/list.service";
import { ExpenseService } from "../expense.service";
import { Expense } from "../expense.model";

@Component({
	selector: "expense-stats",
	imports: [
		ListSwitchComponent,
		AppHighlightBig,
		AsyncPipe,
		CurrencyPipe,
		TitleCasePipe,
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

	ngOnInit(): void {
		const expenseItems$: BehaviorSubject<Expense[]> =
			this.expenseService.expenseList$;
		let expenses$ = this.listService.getExpenses$(
			expenseItems$,
			new BehaviorSubject<string>(""),
			this.checkboxValue$,
		);

		this.expensesKey$ = this.listService.getExpensesKey$(
			expenseItems$,
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
}

import {
	Component,
	inject,
	OnInit,
	signal,
	WritableSignal,
} from "@angular/core";
import { ListSwitchComponent } from "../list/switch/list-switch.component";
import { BehaviorSubject, Observable } from "rxjs";
import { AppHighlightBig } from "../app-highlight-big";
import { AsyncPipe, TitleCasePipe } from "@angular/common";
import { StatsSelectorComponent } from "./category-selector/stats-selector.component";
import { StatsService } from "./stats.service";

/**
 * Service responsible for managing streams of Expense's observable for StatsComponent.
 * @see StatsComponent
 * @see ExpenseService
 */
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
	 * Initialized injecting StatsService service
	 * @protected
	 * @see StatsService
	 */
	protected statsService: StatsService = inject(StatsService);

	readonly subtitle: WritableSignal<string> = signal("Your list");

	/**
	 * BehaviorSubject that stores checkbox values from ListSwitchComponent.
	 * If is true is annually, false is monthly
	 * @see ListSwitchComponent
	 */
	checkboxValue$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false,);

	/**
	 * BehaviorSubject that store selector values from StatsSelectorComponent.
	 * @see StatsSelectorComponent
	 */
	categoryValue$: BehaviorSubject<string> = new BehaviorSubject<string>("all");

	ngOnInit(): void {
		this.statsService.initialize(this.categoryValue$, this.checkboxValue$);
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

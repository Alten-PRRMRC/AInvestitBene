// Import required modules
import { Component, inject, output, OutputEmitterRef } from "@angular/core";
import { TitleCasePipe } from "@angular/common";
import { ExpenseService } from "../../expense.service";

/**
 * Component that shows a selector of categories.
 * Emit the output to the parent component.
 * @see onCategoryChange
 */
@Component({
	selector: "category-selector",
	imports: [TitleCasePipe],
	templateUrl: "./stats-selector.component.html",
	styleUrl: "./stats-selector.component.css",
})
export class StatsSelectorComponent {
	/**
	 * Service for managing expense data
	 * @protected
	 */
	protected _expenseService: ExpenseService = inject(ExpenseService);

	/**
	 * Store value of the selector to emit to the parent component
	 */
	categoryValue: OutputEmitterRef<string> = output<string>();

	/**
	 * Method that emit to the parent component the value of the selector
	 */
	onCategoryChange(event: Event): void {
		this.categoryValue.emit((event.target as HTMLSelectElement).value);
	}
}

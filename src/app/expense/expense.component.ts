// Import required modules

import { UpperCasePipe } from "@angular/common";
import { Component, signal, WritableSignal } from "@angular/core";
import { RouterOutlet } from "@angular/router";

/**
 * This component serves as container as a homepage
 */
@Component({
	selector: "app-expense",
	imports: [UpperCasePipe, RouterOutlet],
	templateUrl: "./expense.component.html",
	styleUrl: "./expense.component.css",
})
export class ExpenseComponent {
	/**
	 * Signal containing the application title
	 * @protected
	 */
	protected readonly title: WritableSignal<string> = signal("AInvestitBene");
	/**
	 * Signal containing the application description
	 * @protected
	 */
	protected readonly description: WritableSignal<string> = signal(
		" Manage and track your personal expenses efficiently. ",
	);
}

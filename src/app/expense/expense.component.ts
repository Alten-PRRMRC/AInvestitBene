// Import required modules

import { Component, inject, signal, WritableSignal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { LocalstorageService } from '../localstorage/localstorage.service';

/**
 * This component serves as homepage, containers of his component
 */
@Component({
	selector: "app-expense",
  imports: [RouterOutlet],
	templateUrl: "./expense.component.html",
	styleUrl: "./expense.component.css",
})
export class ExpenseComponent {
  /**
   * Initialized injecting LocalstorageService service
   * @protected
   * @see LocalstorageService
   */
  private localStorage: LocalstorageService = inject(LocalstorageService);
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

  /**
   * Check in localStorage auth token is initialized
   * @returns Status of auth token in localStorage
   * @see LocalstorageService
   */
  get isAuthenticated(): boolean {
    return !this.localStorage.getItem("AUTH_TOKEN");
  }
}

// Import required modules

import { CommonModule, formatDate } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import {
	AbstractControl,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from "@angular/forms";
import { ActivatedRoute, Params, Router, RouterLink } from "@angular/router";
import { Expense } from "../expense.model";
import { ExpenseService } from "../expense.service";

/**
 * Form validator check if field value is only whitespaces.
 * @param control
 */
function noWhitespaceValidator(
	control: AbstractControl,
): ValidationErrors | null {
	return control.value.trim().length === 0 ? { noWhitespace: true } : null;
}

/**
 * Component provides a reactive form for creating new expense entries.
 */
@Component({
	selector: "expense-form",
	imports: [CommonModule, ReactiveFormsModule, RouterLink],
	templateUrl: "./form.component.html",
	styleUrl: "./form.component.css",
})
export class FormComponent implements OnInit {
	/**
	 * Service for managing expense data
	 * @protected
	 */
  protected _expenseService: ExpenseService = inject(ExpenseService);

	/**
	 * Route for get params in URL
	 * @private
	 */
	private _route: ActivatedRoute = inject(ActivatedRoute);

	/**
	 * Router for navigation after form submission
	 * @private
	 */
	private _router: Router = inject(Router);

	/**
	 * Flag indicating whether the form has unsaved changes
	 * Used by the canDeactivate guard to prevent accidental navigation
	 * @private
	 */
	private _formDirty: boolean = false;

	/**
	 * Current expense to edit
	 * @private
	 */
	private _currentExpense: Expense | undefined;

	/**
	 * The reactive form group that contains all form controls:
	 * - Description: Required, minimum 2 characters
	 * - Import: Required, minimum value of 1
	 * - Category: Required, defaults to the first element of ExpenseCategory
	 * - Date: Required, defaults to current date
	 * @see ExpenseCategory
	 */
	expenseForm: FormGroup = new FormGroup({
		description: new FormControl("", [
			Validators.required,
			Validators.minLength(2),
			noWhitespaceValidator,
		]),
		import: new FormControl(1, [Validators.required, Validators.min(1)]),
		category: new FormControl(this._expenseService.categories[0], [Validators.required]),
		date: new FormControl(formatDate(Date.now(), "yyyy-MM-dd", "en"), [
			Validators.required,
		]),
	});

	ngOnInit(): void {
		// Track form changes to set formDirty flag for the canDeactivate guard
		this.expenseForm.valueChanges.subscribe((): void => {
			this._formDirty = this.expenseForm.dirty;
		});
		// Track url changes and get id of the current expenses
		this._route.queryParams.subscribe((query: Params): void => {
			const expenseId = query["id"] || undefined;
			// Initialize form with expense value if id exists or use default
			this._currentExpense = this._expenseService.getById(expenseId);
			this.resetForm(this._currentExpense);
		});
	}

	/**
	 * Handles form submission when the user clicks the Save button
	 *
	 * If the form is valid:
	 * 1. Creates a new Expense object with the form values
	 * 2. Adds the expense to the ExpenseService
	 * 3. Resets the form dirty state
	 * 4. Navigate back to the home page
	 */
	onSubmit(): void {
		if (!this.expenseForm.valid) return;
		const newExpense: Expense = {
			id: Date.now().toString(), // Simple ID generation using timestamp
			...this.expenseForm.value,
		};
		newExpense.date = new Date(newExpense.date);
		// If current expense exists it's not new
		if (this._currentExpense) {
			newExpense.id = this._currentExpense.id;
			this._expenseService.updateItem(newExpense);
		} else {
			this._expenseService.addItem(newExpense);
		}
		this._formDirty = false;
		this._router.navigate(["/"]);
	}

	/**
	 * Resets the form to its initial state or to the current expense values.
	 *
	 * If current expense doesn't exist, set all user inputs to the default values:
	 * - Description: empty string
	 * - Import: 1
	 * - Category: to the first element of ExpenseCategory
	 * - Date: current date
	 *
	 * Resets the formDirty flag to prevent the deactivation guard from triggering
	 * @see ExpenseCategory
	 */
	resetForm(expense?: Expense): void {
		const defaultValue = {
			description: "",
			import: 1,
			category: this._expenseService.categories[0],
			date: formatDate(Date.now(), "yyyy-MM-dd", "en"),
		};
		const value = expense
			? {
					description: expense.description,
					import: expense.import,
					category: expense.category,
					date: formatDate(expense.date, "yyyy-MM-dd", "en"),
				}
			: defaultValue;
		this.expenseForm.reset(value);
		this._formDirty = false;
	}

	/**
	 * Called by the canDeactivateGuard when the user tries to navigate away from the form
	 *
	 * @returns
	 * - true if the form has no unsaved changes (allowing navigation)
	 * - A Promise that resolves to the user's choice from a confirmation dialog if there are unsaved changes
	 */
	canDeactivate(): boolean | Promise<boolean> {
		return !this._formDirty
			? true
			: new Promise<boolean>((resolve) => {
					const result = window.confirm(
						"You have unsaved changes. Do you really want to leave?",
					);
					resolve(result);
				});
	}
}

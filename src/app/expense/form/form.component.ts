// Import required modules

import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule, ValidationErrors,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Expense, ExpenseCategory } from "../expense.model";
import { ExpenseService } from "../expense.service";

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
	 * @private
	 */
	private expenseService: ExpenseService = inject(ExpenseService);

	/**
	 * Router for navigation after form submission
	 * @private
	 */
	private router: Router = inject(Router);

	/**
	 * Available expense categories for the dropdown selection
	 */
	categories: ExpenseCategory[] = ["fashion", "groceries", "cryptocurrency"];

	/**
	 * Flag indicating whether the form has unsaved changes
	 * Used by the canDeactivate guard to prevent accidental navigation
	 */
	formDirty = false;

  /**
   * Form validator check if field value is only whitespaces.
   * @param control
   */
  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    return control.value.trim().length === 0 ?
      {noWhitespace: true} : null
  }

	/**
	 * The reactive form group that contains all form controls:
	 * - Description: Required, minimum 3 characters
	 * - Import: Required, minimum value of 1
	 * - Category: Required, defaults to first element of ExpenseCategory
	 * - Date: Required, defaults to current date
	 * @see ExpenseCategory
	 */
	expenseForm: FormGroup = new FormGroup({
		description: new FormControl("", [
			Validators.required,
			Validators.minLength(3),
      this.noWhitespaceValidator
		]),
		import: new FormControl(1, [Validators.required, Validators.min(1)]),
		category: new FormControl(this.categories[0], [Validators.required]),
		date: new FormControl(new Date(), [Validators.required]),
	});

	ngOnInit(): void {
		// Track form changes to set formDirty flag for the canDeactivate guard
		this.expenseForm.valueChanges.subscribe(() => {
			this.formDirty = this.expenseForm.dirty;
		});
	}

	/**
	 * Handles form submission when the user clicks the Save button
	 *
	 * If the form is valid:
	 * 1. Creates a new Expense object with the form values
	 * 2. Adds the expense to the ExpenseService
	 * 3. Resets the form dirty state
	 * 4. Navigates back to the home page
	 */
	onSubmit(): void {
		if (this.expenseForm.valid) {
			const newExpense: Expense = {
				id: Date.now().toString(), // Simple ID generation using timestamp
				...this.expenseForm.value,
			};
      newExpense.date = new Date(newExpense.date);

			this.expenseService.addItem(newExpense);
			this.formDirty = false;
			this.router.navigate(["/"]);
		}
	}

	/**
	 * Resets the form to its initial state
	 *
	 * This clears all user input and validation errors, and sets:
	 * - Description: empty string
	 * - Import: 1
	 * - Category: to first element of ExpenseCategory
	 * - Date: current date
	 *
	 * Resets the formDirty flag to prevent the deactivation guard from triggering
	 * @see ExpenseCategory
	 */
	resetForm(): void {
		this.expenseForm.reset({
			description: "",
			import: 1,
			category: this.categories[0],
			date: new Date(),
		});
		this.formDirty = false;
	}

	/**
	 * Called by the canDeactivateGuard when the user tries to navigate away from the form
	 *
	 * @returns
	 * - true if the form has no unsaved changes (allowing navigation)
	 * - A Promise that resolves to the user's choice from a confirmation dialog if there are unsaved changes
	 */
	canDeactivate(): boolean | Promise<boolean> {
		if (!this.formDirty) {
			return true;
		}

		return new Promise<boolean>((resolve) => {
			const result = window.confirm(
				"You have unsaved changes. Do you really want to leave?",
			);
			resolve(result);
		});
	}
}

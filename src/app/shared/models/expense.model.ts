/**
 * Represents an expense entry in the application.
 */
export interface Expense {
	/** Unique identifier for the expense */
	id: string;
	/** Description of the expense */
	description: string;
	/** Monetary value of the expense */
	import: number;
	/** Category classification of the expense */
	category: ExpenseCategory;
	/** Date when the expense occurred */
	date: Date;
}

/**
 * Defines const of categories.
 */
const categories = ["fashion", "groceries", "cryptocurrency"] as const;

/**
 * Defines the available categories for expense classification.
 */
export type ExpenseCategory = (typeof categories)[number];

/**
 * Const array of categories.
 */
export const ArrExpenseCategory: ExpenseCategory[] = [...categories];

/**
 * Represents an expense entry in the application.
 */
export interface Expense {
  /** Unique identifier for the expense */
  id: string,
  /** Description of the expense */
  description: string,
  /** Monetary value of the expense */
  import: number,
  /** Category classification of the expense */
  category: ExpenseCategory,
  /** Date when the expense occurred */
  data: Date,
}

/**
 * Defines the available categories for expense classification.
 */
export type ExpenseCategory = 'fashion' | 'groceries';

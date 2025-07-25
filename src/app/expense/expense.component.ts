// Import required modules
import {Component, signal, WritableSignal} from '@angular/core';

/**
 * This component serves as container as a homepage
 */
@Component({
  selector: 'app-expense',
  imports: [],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent {
  /**
   * Signal containing the application title
   * @protected
   */
  protected readonly title: WritableSignal<string> = signal('AInvestBene');
}

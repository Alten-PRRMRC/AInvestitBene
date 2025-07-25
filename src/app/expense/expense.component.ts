import {Component, signal, WritableSignal} from '@angular/core';

@Component({
  selector: 'app-expense',
  imports: [],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent {
  protected readonly title: WritableSignal<string> = signal('AInvestBene');
}

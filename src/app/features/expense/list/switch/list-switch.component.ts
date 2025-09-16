import {Component, output, OutputEmitterRef} from '@angular/core';

/**
 * Component that show a checkbox as a switch.
 * Emit the output of the checkbox to the parent component.
 * @see onCheckboxChange
 */
@Component({
  selector: 'list-switch',
  imports: [],
  templateUrl: './list-switch.component.html',
  styleUrl: './list-switch.component.css'
})
export class ListSwitchComponent {
  /**
   * Store value of the checkbox to emit to the parent component
   */
  checkboxChange: OutputEmitterRef<boolean> = output<boolean>();

  /**
   * Method that emit to the parent component the value of the checkbox
   */
  onCheckboxChange(event: Event): void {
    this.checkboxChange.emit((event.target as HTMLInputElement).checked);
  }
}

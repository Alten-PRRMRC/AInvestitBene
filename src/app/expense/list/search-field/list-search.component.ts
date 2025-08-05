// Import required modules
import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';

/**
 * Component that show a search field.
 * Emit the output of the query to the parent component.
 * @see onSearchUpdate
 */
@Component({
  selector: 'list-search',
  imports: [],
  templateUrl: './list-search.component.html',
  styleUrl: './list-search.component.css'
})
export class ListSearchComponent {
  /**
   * Store query value of the search field to emit to the parent component
   */
  searchChange: OutputEmitterRef<string> = output<string>();

  /**
   * Option if the query value emitted need to be case-sensitive.
   * Default is case-sensitive.
   */
  caseSensitive: InputSignal<boolean> = input<boolean>(true);

  /**
   * Method that emit to the parent component the query value of the search field
   */
  onSearchUpdate(query: string): void{
    if(this.caseSensitive()){
      this.searchChange.emit(query);
    } else {
      this.searchChange.emit(query.toLowerCase().replace(/\s/g, ""));
    }
  }
}

// Import required modules
import { Component, output, OutputEmitterRef } from '@angular/core';

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
   * Method that emit to the parent component the query value of the search field
   */
  onSearchUpdate(query: string): void{
      this.searchChange.emit(query);
  }
}

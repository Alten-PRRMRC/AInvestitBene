// Import required modules

import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {LocalstorageService} from '../localstorage/localstorage.service';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

/**
 * Component that shows a navbar to navigate on pages
 */
@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  localStorage: LocalstorageService = inject(LocalstorageService);
  theme = new FormControl<boolean | null>(false);
  /**
   * Key used for storing theme in localStorage
   * @private
   */
  private readonly STORAGE_KEY = "THEME";

  constructor(){
    this.theme.setValue(!!this.localStorage.getItem<boolean>(this.STORAGE_KEY));
  }

  onCheckboxChange(event: Event): void {
    this.theme.setValue((event.target as HTMLInputElement).checked);
    this.localStorage.setItem<boolean>(this.STORAGE_KEY, (event.target as HTMLInputElement).checked);
  }
}

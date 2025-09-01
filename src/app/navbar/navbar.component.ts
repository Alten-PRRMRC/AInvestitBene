// Import required modules

import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {LocalstorageService} from '../localstorage/localstorage.service';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {SunIcon} from '../resources/icons/app-navbar-icon-sun';
import {MoonIcon} from '../resources/icons/app-navbar-icon-moon';
import {HomeIcon} from '../resources/icons/app-navbar-icon-home';
import {AddIcon} from '../resources/icons/app-navbar-icon-add';
import {StatsIcon} from '../resources/icons/app-navbar-icon-stats';
import {AboutIcon} from '../resources/icons/app-navbar-icon-about';

/**
 * Component that shows a navbar to navigate on pages
 */
@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    SunIcon,
    MoonIcon,
    HomeIcon,
    AddIcon,
    StatsIcon,
    AboutIcon
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

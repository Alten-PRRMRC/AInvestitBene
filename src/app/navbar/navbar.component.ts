// Import required modules

import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

/**
 * Component that shows a navbar to navigate on pages
 */
@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent { }

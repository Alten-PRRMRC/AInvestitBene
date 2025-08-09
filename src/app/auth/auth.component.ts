// Import required modules
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { LocalstorageService } from "../localstorage/localstorage.service";

/**
 * Component that provides a user interface for login and registration.
 */
@Component({
	selector: "app-auth",
	imports: [],
	templateUrl: "./auth.component.html",
	styleUrl: "./auth.component.css",
})
export class AuthComponent {
  /**
   * Injects localStorage service
   * @see LocalstorageService
   * @private
   */
	private localstorage: LocalstorageService = inject(LocalstorageService);

  /**
   * Injects Router service
   * @see Router
   * @private
   */
	private router: Router = inject(Router);

  /**
   * Key used for storing auth token in localStorage
   * @private
   */
  private readonly STORAGE_KEY = "AUTH_TOKEN";

  /**
   * Initialize value in localStorage through the key and reload the page.
   * @see STORAGE_KEY
   * @see Router
   * @see LocalstorageService
   */
  auth() {
		this.localstorage.setItem<string>(this.STORAGE_KEY, "dummy");
		this.router.navigate([""]);
	}
}

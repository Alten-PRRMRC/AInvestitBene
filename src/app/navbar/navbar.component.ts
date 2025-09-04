// Import required modules

import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { LocalstorageService } from "../localstorage/localstorage.service";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { SunIcon } from "../resources/icons/app-navbar-icon-sun";
import { MoonIcon } from "../resources/icons/app-navbar-icon-moon";
import { HomeIcon } from "../resources/icons/app-navbar-icon-home";
import { AddIcon } from "../resources/icons/app-navbar-icon-add";
import { StatsIcon } from "../resources/icons/app-navbar-icon-stats";
import { AboutIcon } from "../resources/icons/app-navbar-icon-about";

/**
 * Component that shows a navbar to navigate on pages
 */
@Component({
	selector: "app-navbar",
	imports: [
		RouterLink,
		RouterLinkActive,
		ReactiveFormsModule,
		SunIcon,
		MoonIcon,
		HomeIcon,
		AddIcon,
		StatsIcon,
		AboutIcon,
	],
	templateUrl: "./navbar.component.html",
	styleUrl: "./navbar.component.css",
})
export class NavbarComponent {
	private readonly iconClass = "size-[1.2em] fill-current";

	/**
	 * Items of the navbar to navigate through the site
	 *
	 *
	 * - `label`: The display name of the navigation item;
	 * - `route`: The Angular route path to navigate to;
	 * - `iconComponent`: Icon as an Angular component;
	 *    - `component`: Name of the angular component
	 *    - `class`: CSS class apply to icon;
	 * - `exact`: Optional, if `true`, the route match must be exact and add a css clas.
	 */
	navItems = [
		{
			label: "Home",
			route: "/",
			iconComponent: {
				component: "app-navbar-icon-home",
				class: this.iconClass,
			},
			exact: true,
		},
		{
			label: "Add",
			route: "/add",
			iconComponent: {
				component: "app-navbar-icon-add",
				class: this.iconClass,
			},
		},
		{
			label: "Stats",
			route: "/stats",
			iconComponent: {
				component: "app-navbar-icon-stats",
				class: this.iconClass,
			},
		},
		{
			label: "About",
			route: "/about",
			iconComponent: {
				component: "app-navbar-icon-about",
				class: this.iconClass,
			},
		},
	];

	/**
	 * Form control to manage application's theme setting.
	 */
	themeController: FormControl<boolean | null> = new FormControl<
		boolean | null
	>(false);

	/**
	 * Key used for storing theme in _localStorage
	 * @private
	 */
	private readonly STORAGE_KEY = "THEME";

	/**
	 * Service for interacting with browser's local storage.
	 * @private
	 */
	private _localStorage: LocalstorageService = inject(LocalstorageService);

	constructor() {
		// Fix bug when use '--preferdark' in daisyUI as force the theme with that flag
		const preferTheme: boolean = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		this.themeController.setValue(
			this._localStorage.getItem<boolean>(this.STORAGE_KEY) ?? preferTheme,
		);
	}

	onCheckboxChange(event: Event): void {
		const value: boolean = (event.target as HTMLInputElement).checked;
		this.themeController.setValue(value);
		this._localStorage.setItem<boolean>(this.STORAGE_KEY, value);
	}
}

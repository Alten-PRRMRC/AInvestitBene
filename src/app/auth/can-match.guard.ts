// Import required modules
import { Injectable } from "@angular/core";
import type { CanMatch } from "@angular/router";
import type { LocalstorageService } from "../localstorage/localstorage.service";
import type { Observable } from "rxjs";

/**
 * Guard responsible to check if the user is already logged in.
 * This class check in localStorage API if there is already AUTH_TOKEN saved.
 * @see CanMatch
 */
@Injectable({
	providedIn: "root",
})
export class canMatchGuard implements CanMatch {
	constructor(private localstorage: LocalstorageService) {}

	/**
	 * Check in the localStorage API if there is already AUTH_TOKEN
	 * @returns An bool if AUTH_TOKEN is already saved in localStorage
	 */
	canMatch(): Observable<boolean> | Promise<boolean> | boolean {
		return this.isUserAuthorized();
	}

	private isUserAuthorized(): boolean {
		return this.localstorage.getItem<string>("AUTH_TOKEN") != null;
	}
}

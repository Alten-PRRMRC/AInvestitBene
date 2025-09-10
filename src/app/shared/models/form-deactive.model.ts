import { Observable } from "rxjs";

/**
 * Represents a guard that can determine if a form can be deactivated.
 */
export interface CanFormDeactivate {
	/**
	 * Method to check if the form can be deactivated.
	 *
	 * @returns An observable, promise, or boolean indicating whether the form can be deactivated.
	 */
	canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

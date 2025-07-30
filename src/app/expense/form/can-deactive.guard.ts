// Import required modules
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanDeactivate } from '@angular/router';
import { CanFormDeactivate } from './form-deactive.model';

/**
 * Guard responsible to checks if the form component can be deactivated.
 * Used to prevent users from accidentally navigating away from a form with unsaved changes.
 * @see CanDeactivate
 * @see CanFormDeactivate
 */
@Injectable({
  providedIn: 'root',
})
export class canDeactivateGuard implements CanDeactivate<CanFormDeactivate> {

  /**
   * Check in the form is dirty
   * @returns An bool if user want leave the page.
   */
  canDeactivate(form: CanFormDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    return form.canDeactivate ? form.canDeactivate() : true;
  }
}

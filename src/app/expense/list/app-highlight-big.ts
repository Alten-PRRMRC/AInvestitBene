import {AfterViewInit, Directive, ElementRef, inject, input, InputSignal, OnDestroy} from '@angular/core';

/**
 * Custom Directive that check if value is major of assigned import and add css class
 * @see limitImport
 */
@Directive({
  selector: '[appAppHighlightBig]'
})
export class AppHighlightBig implements OnDestroy, AfterViewInit {

  /**
   * Limit of the value to check
   */
  limitImport: InputSignal<number> = input(500);

  /**
   * Element which this directive is assigned
   * @private
   */
  private el: ElementRef = inject(ElementRef);
  ngAfterViewInit(): void {
    let elImport: string = this.el.nativeElement.innerHTML.substring(1).replace(",", "").split(".");
    this.el.nativeElement.innerHTML = Number(elImport[0]) > this.limitImport() ?
      `<b class="badge badge-dash badge-warning bg-warning text-warning-content">${this.el.nativeElement.innerHTML}</b>` :
      this.el.nativeElement.innerHTML;
  }

  ngOnDestroy() {
    this.el.nativeElement.innerHTML = '';
  }
}

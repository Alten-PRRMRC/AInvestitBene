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
    let currency: string = this.el.nativeElement.innerHTML.charAt(0)
    let elImport: string = this.el.nativeElement.innerHTML.substring(1);
    this.el.nativeElement.innerHTML = Number(elImport) > this.limitImport() ?
      `<span class="highlighted-category">${currency}${elImport}</span>` :
      this.el.nativeElement.innerHTML;
  }

  ngOnDestroy() {
    this.el.nativeElement.innerHTML = '';
  }
}

import {
	Directive,
	effect,
	ElementRef,
	inject,
	input,
	InputSignal,
	OnDestroy,
	Renderer2,
} from "@angular/core";
/**
 * Custom Directive that check if value is major of assigned import and add css class
 * @see limitImport
 */
@Directive({
	selector: "[AppHighlightBig]",
})
export class AppHighlightBig implements OnDestroy {
	/**
	 * Element which this directive is assigned
	 * @private
	 */
	private el: ElementRef = inject(ElementRef);

	private render: Renderer2 = inject(Renderer2);

	/**
	 * Limit of the value to check
	 */
	limitImport: InputSignal<number> = input(500);

	/**
	 * Value to confront with limit
	 */
	amountImport: InputSignal<number> = input.required<number>();

	/**
	 * Currency type to display the amount
	 */
	currencyImport: InputSignal<string> = input("EUR");

	constructor() {
		effect((): void => {
			const limit: number = this.limitImport();
			const value: number = this.amountImport();
			const currency: string = this.currencyImport();
			const formatted: string = new Intl.NumberFormat("en-UK", {
				style: "currency",
				currency: currency,
			}).format(value);

			let html: string = formatted;
			if (value > limit) {
				html = `<b class="badge badge-dash badge-warning bg-warning text-warning-content">${formatted}</b>`;
			} else if (value < -limit) {
				html = `<b class="badge badge-dash badge-error bg-error text-error-content">${formatted}</b>`;
			}
			this.render.setProperty(this.el.nativeElement, "innerHTML", html);
		});
	}

	ngOnDestroy(): void {
		this.el.nativeElement.innerHTML = "";
	}
}

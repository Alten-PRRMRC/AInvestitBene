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
		effect(() => {
			const limit = this.limitImport();
			const value = this.amountImport();
			const currency = this.currencyImport();
			const formatted = new Intl.NumberFormat("en-UK", {
				style: "currency",
				currency: currency,
			}).format(value);

			let html =
				value > limit
					? `<b class="badge badge-dash badge-warning bg-warning text-warning-content">${formatted}</b>`
					: formatted;
			this.render.setProperty(this.el.nativeElement, "innerHTML", html);
		});
	}

	ngOnDestroy() {
		this.el.nativeElement.innerHTML = "";
	}
}

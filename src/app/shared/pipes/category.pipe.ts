import { Pipe, PipeTransform } from "@angular/core";
import { SafeHtml } from "@angular/platform-browser";

/**
 * Custom Pipe that check if category is 'Cryptocurrency' and add css class
 */
@Pipe({
	name: "category",
})
export class CategoryPipe implements PipeTransform {
	/**
	 * Add css class when the category is 'Cryptocurrency'
	 * @param value - String where pipes is used
	 * @return SafeHtml
	 */
	transform(value: string): SafeHtml {
		return value.toLocaleLowerCase() === "cryptocurrency"
			? `<b class="badge badge-dash badge-warning bg-warning text-warning-content">${value}</b>`
			: value;
	}
}

import { Component, inject } from "@angular/core";
import { LocalstorageService } from "@core/services";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-about",
	imports: [RouterLink],
	templateUrl: "./about.component.html",
	styleUrl: "./about.component.css",
})
export class AboutComponent {
	private localStorageService = inject(LocalstorageService);

	reset() {
		this.localStorageService.clear();
	}
}

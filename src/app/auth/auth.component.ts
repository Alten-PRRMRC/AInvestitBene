import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { LocalstorageService } from "../localstorage/localstorage.service";

@Component({
	selector: "app-auth",
	imports: [],
	templateUrl: "./auth.component.html",
	styleUrl: "./auth.component.css",
})
export class AuthComponent {
	private localstorage: LocalstorageService = inject(LocalstorageService);
	private router: Router = inject(Router);

	auth() {
		this.localstorage.setItem<string>("AUTH_TOKEN", "dummy");
		this.router.navigate([""]);
	}
}

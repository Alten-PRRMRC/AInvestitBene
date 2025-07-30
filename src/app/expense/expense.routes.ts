import type { Routes } from "@angular/router";
import { canMatchGuard } from "../auth/can-match.guard";
import { canDeactivateGuard } from "./form/can-deactive.guard";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () =>
			import("./list/list.component").then((m) => m.ListComponent),
		canMatch: [canMatchGuard],
	},
	{
		path: "",
		loadComponent: () =>
			import("../auth/auth.component").then((m) => m.AuthComponent),
	},
	{
		path: "add",
		loadComponent: () =>
			import("./form/form.component").then((m) => m.FormComponent),
		canMatch: [canMatchGuard],
		canDeactivate: [canDeactivateGuard],
	},
];

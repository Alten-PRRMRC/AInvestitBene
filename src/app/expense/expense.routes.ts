import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () =>
			import("./list/list.component").then((m) => m.ListComponent),
	},
	{
		path: "add",
		loadComponent: () =>
			import("./form/form.component").then((m) => m.FormComponent),
	},
];

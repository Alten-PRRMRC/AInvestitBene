import type { Routes } from "@angular/router";
import { routes as expenseRoutes } from "@features/expense/expense.routes";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () =>
			import("@features/expense/expense.component").then(
				(m) => m.ExpenseComponent,
			),
		children: expenseRoutes,
		title: "Expense List",
	},
	{
		path: "about",
		loadComponent: () =>
			import("@features/about/about.component").then((m) => m.AboutComponent),
		title: "About",
	},
	{
		path: "**",
		loadComponent: () =>
			import("@features/not-found/not-found.component").then(
				(m) => m.NotFoundComponent,
			),
		title: "Oops",
	},
];

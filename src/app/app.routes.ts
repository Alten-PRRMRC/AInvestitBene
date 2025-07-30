import type { Routes } from "@angular/router";
import { routes as expenseRoutes } from "./expense/expense.routes";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () =>
			import("./expense/expense.component").then((m) => m.ExpenseComponent),
		children: expenseRoutes,
		title: "Expense List",
	},
	{
		path: "**",
		loadComponent: () =>
			import("./not-found/not-found.component").then(
				(m) => m.NotFoundComponent,
			),
		title: "Oops",
	},
];

import type { Routes } from "@angular/router";
import { routes as expenseRoutes } from "./expense/expense.routes";
import { canMatchGuard } from "./auth/can-match.guard";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () =>
			import("./expense/expense.component").then((m) => m.ExpenseComponent),
		children: expenseRoutes,
		canMatch: [canMatchGuard],
		title: "Expense List",
	},
	{
		path: "",
		loadComponent: () =>
			import("./auth/auth.component").then((m) => m.AuthComponent),
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

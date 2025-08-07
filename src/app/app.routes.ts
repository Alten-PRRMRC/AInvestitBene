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
    path: "about",
    loadComponent: () =>
      import("./about/about.component").then((m) => m.AboutComponent),
    title: "About",
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

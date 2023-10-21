import { Routes } from "@angular/router";
import { HomePage } from "./pages/home/home.page";
import { TabsPage } from "./layout/tabs.page";
import { authGuard } from "./auth.guard";

export const routes: Routes = [
  {
    path: "",
    component: HomePage,
  },
  {
    path: "app",
    component: TabsPage,
    canActivateChild: [authGuard],
    children: [
      {
        path: "word-lists",
        loadComponent: () =>
          import("./pages/word-lists/word-lists.page").then(
            (m) => m.WordListsPage,
          ),
      },
      {
        path: "settings",
        loadComponent: () =>
          import("./pages/settings/settings.page").then((m) => m.SettingsPage),
      },
      {
        path: "",
        redirectTo: "word-lists",
        pathMatch: "full",
      },
    ],
  },
];

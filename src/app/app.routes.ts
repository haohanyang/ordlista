import { Routes } from "@angular/router";
import { HomePage } from "./pages/home/home.page";
import { TabsPage } from "./layout/tabs.page";
import { authGuard } from "./auth.guard";
import { wordlistResolver } from "./pages/word-list/word-list.resolve"
import { WordListComponent } from "./pages/word-list/word-list.page"

export const routes: Routes = [
  {
    path: "",
    component: HomePage,
  },
  {
    path: "tabs",
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
  {
    path: "lists/:id",
    component: WordListComponent,
    title: "List",
    canActivate: [authGuard],
    resolve: {
      listResult: wordlistResolver
    }
  }
];

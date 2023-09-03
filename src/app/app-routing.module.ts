import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { HomeComponent } from "./pages/home/home.component"
import { WordlistComponent } from "./pages/wordlist/wordlist.component"
import { WordlistsComponent } from "./pages/wordlists/wordlists.component"
import { wordlistResolver } from "./pages/wordlist/wordlist.resolve"
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component"
import { LogInComponent } from "./pages/login/login.component"
import { SignUpComponent } from "./pages/signup/signup.component"
import { authGuard } from "./auth.guard"
import { DiscoverComponent } from "./pages/discover/discover.component"
import { SettingsComponent } from "./pages/settings/settings.component"

const routes: Routes = [
  {
    path: "",
    title: "Ordlista",
    component: HomeComponent
  },
  {
    path: "login",
    title: "Log in",
    component: LogInComponent
  },
  {
    path: "signup",
    title: "Sign up",
    component: SignUpComponent
  },
  {
    path: "my-lists",
    title: "My lists",
    component: WordlistsComponent,
    canActivate: [authGuard]
  },
  {
    path: "lists/:id",
    component: WordlistComponent,
    canActivate: [authGuard],
    resolve: {
      listResult: wordlistResolver
    }
  },
  {
    path: "discover",
    title: "Discover",
    component: DiscoverComponent,
    canActivate: [authGuard]
  },
  {
    path: "settings",
    title: "Settings",
    component: SettingsComponent,
    canActivate: [authGuard]
  },
  {
    path: "**",
    title: "Not found",
    component: NotFoundPageComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

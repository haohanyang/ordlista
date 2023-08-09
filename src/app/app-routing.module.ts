import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { HomeComponent } from "./pages/home/home.component"
import { AuthComponent } from "./pages/auth/auth.component"
import { WordlistComponent } from "./pages/wordlist/wordlist.component"
import { WordlistsComponent } from "./pages/wordlists/wordlists.component"
import { authResolver } from "./auth.resolver"
import { wordlistResolver } from "./pages/wordlist/wordlist.resolve"
import { AboutComponent } from "./pages/about/about.component"

const routes: Routes = [
  {
    path: "",
    title: "Hem",
    component: HomeComponent
  },
  {
    path: "om-oss",
    title: "Om oss",
    component: AboutComponent
  },
  {
    path: "auth",
    title: "Logga in",
    component: AuthComponent
  },
  {
    path: "mina-listor",
    title: "Mina listor",
    component: WordlistsComponent,
    resolve: { userId: authResolver }
  },
  {
    path: "lista/:id",
    title: "Lista",
    component: WordlistComponent,
    resolve: {
      userId: authResolver,
      listInfo: wordlistResolver
    }
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

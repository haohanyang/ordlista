import { NgModule, isDevMode } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { ReactiveFormsModule } from "@angular/forms"
import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { HomeComponent } from "./pages/home/home.component"
import { WordlistsComponent } from "./pages/wordlists/wordlists.component"
import { WordlistComponent } from "./pages/wordlist/wordlist.component"
import { WordCardComponent } from "./components/word-card/word-card.component"
import { AuthComponent } from "./pages/auth/auth.component"
import { AmplifyAuthenticatorModule } from "@aws-amplify/ui-angular"
import { WordlistcardComponent } from "./components/word-list-card/word-list-card.component"
import { HttpClientModule } from "@angular/common/http"
import AuthService from "./auth.service"
import HttpService from "./http.service"
import { AboutComponent } from "./pages/about/about.component"
import { SaveListModalComponent } from "./components/save-list-modal/save-list-modal.component"
import { DeleteModalComponent } from "./components/delete-modal/delete-modal.component"
import { SearchWordModalComponent } from "./components/search-word-modal/search-word-modal.component"
import { SearchResultEntryComponent } from "./components/search-result-entry/search-result-entry.component";
import { ServiceWorkerModule } from '@angular/service-worker'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WordlistsComponent,
    WordlistComponent,
    WordCardComponent,
    AuthComponent,
    WordlistcardComponent,
    AboutComponent,
    SaveListModalComponent,
    DeleteModalComponent,
    SearchWordModalComponent,
    SearchResultEntryComponent
  ],
  imports: [
    BrowserModule,
    AmplifyAuthenticatorModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [HttpService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

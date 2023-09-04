import { NgModule, isDevMode } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { ReactiveFormsModule } from "@angular/forms"
import { AppRoutingModule } from "./app-routing.module"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatIconModule } from "@angular/material/icon"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatButtonModule } from "@angular/material/button"
import { MatMenuModule } from "@angular/material/menu"
import { MatTabsModule } from "@angular/material/tabs"
import { AppComponent } from "./app.component"
import { HomeComponent } from "./pages/home/home.component"
import { WordlistsComponent } from "./pages/wordlists/wordlists.component"
import { WordlistComponent } from "./pages/wordlist/wordlist.component"
import { WordCardComponent } from "./components/word-card/word-card.component"
import { AmplifyAuthenticatorModule } from "@aws-amplify/ui-angular"
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http"
import { TopNavComponent } from "./components/top-nav/top-nav.component"
import { SaveListModalComponent } from "./components/save-list-modal/save-list-modal.component"
import { DeleteModalComponent } from "./components/delete-modal/delete-modal.component"
import { SearchWordModalComponent } from "./components/search-word-modal/search-word-modal.component"
import { SearchResultEntryComponent } from "./components/search-result-entry/search-result-entry.component"
import { ServiceWorkerModule } from "@angular/service-worker"
import { MatDividerModule } from "@angular/material/divider"
import { MatListModule } from "@angular/material/list"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatDialogModule } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { MatInputModule } from "@angular/material/input"
import { MatCardModule } from "@angular/material/card"
import { MatExpansionModule } from "@angular/material/expansion"
import { SaveWordModalComponent } from "./components/save-word-modal/save-word-modal.component"
import { BottomBarComponent } from "./components/bottom-nav/bottom-nav.component"
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component"
import { SignUpComponent } from "./pages/signup/signup.component"
import { LogInComponent } from "./pages/login/login.component"
import { MatBottomSheetModule } from "@angular/material/bottom-sheet"
import { AddWordSheetComponent } from "./components/add-word-sheet/add-word-sheet.component"
import { SettingsComponent } from "./pages/settings/settings.component"
import { DiscoverComponent } from "./pages/discover/discover.component"
import { LogoutModalComponent } from "./components/logout-modal/logout-modal.component"
import { MatTableModule } from '@angular/material/table'
import AuthService from "./auth.service"
import HttpService from "./http.service"
import { HttpRequestInterceptor } from "./http.interceptor";
import { InfoModalComponent } from './components/info-modal/info-modal.component'
@NgModule({
    declarations: [
        AppComponent, HomeComponent, WordlistsComponent, WordlistComponent, WordCardComponent,
        SaveListModalComponent, DeleteModalComponent, SearchWordModalComponent,
        SearchResultEntryComponent, SaveWordModalComponent,
        BottomBarComponent, NotFoundPageComponent, SignUpComponent,
        SignUpComponent, LogInComponent, TopNavComponent,
        AddWordSheetComponent, SettingsComponent, DiscoverComponent, LogoutModalComponent, InfoModalComponent
    ],
    imports: [
        BrowserModule, AppRoutingModule, BrowserAnimationsModule,
        AmplifyAuthenticatorModule, MatInputModule, MatToolbarModule,
        MatTooltipModule, MatFormFieldModule, ReactiveFormsModule,
        HttpClientModule, BrowserAnimationsModule, MatToolbarModule,
        MatIconModule, MatButtonModule, MatTabsModule,
        MatMenuModule, MatDividerModule, MatListModule,
        MatProgressSpinnerModule, MatDialogModule, MatSnackBarModule,
        MatCardModule, MatExpansionModule, MatBottomSheetModule,
        MatTableModule,
        ServiceWorkerModule.register("ngsw-worker.js", {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: "registerWhenStable:30000"
        })
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
        HttpService, AuthService],
    bootstrap: [AppComponent]
})
export class AppModule { }

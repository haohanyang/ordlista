import { enableProdMode, importProvidersFrom } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { RouteReuseStrategy, provideRouter } from "@angular/router";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { routes } from "./app/app.routes";
import { AppComponent } from "./app/app.component";
import { environment } from "./environments/environment";
import { Amplify } from "aws-amplify";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { AuthInterceptor } from "./app/auth.interceptor";

if (environment.production) {
  enableProdMode();
}

Amplify.configure({
  aws_cognito_region: "eu-north-1",
  aws_user_pools_id: import.meta.env.NG_APP_COGNITO_USER_POOL_ID,
  aws_user_pools_web_client_id: import.meta.env
    .NG_APP_COGNITO_USER_POOL_CLIENT_ID,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
});

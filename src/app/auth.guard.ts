import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { Auth } from "aws-amplify";
import AuthService from "./service/auth.service";

export const authGuard: CanActivateFn = async (_route, _state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return Auth.currentAuthenticatedUser()
    .then((e) => {
      authService.userIdSubject$.next(e.username);
      return true;
    })
    .catch(() => router.parseUrl("/"));
};

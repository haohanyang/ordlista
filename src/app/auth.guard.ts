import { CanActivateFn, Router } from "@angular/router"
import { inject } from "@angular/core"
import { Auth } from "aws-amplify"

export const authGuard: CanActivateFn = async (_route, _state) => {
  const router = inject(Router)
  return Auth.currentAuthenticatedUser().then(() => true).catch(() => router.parseUrl("/login"))
}
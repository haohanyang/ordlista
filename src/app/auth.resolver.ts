import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router"
import { inject } from "@angular/core"
import AuthService from "./auth.service"

export const authResolver: ResolveFn<string | null> = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService)
  return authService.getUserId()
}

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router"
import { WordList } from "../../models/wordlist"
import { inject } from "@angular/core"
import HttpService, { HttpServiceResponse } from "../../http.service"

export const wordlistResolver: ResolveFn<HttpServiceResponse<WordList>> = (route: ActivatedRouteSnapshot) => {
    const httpService = inject(HttpService)
    const listId = route.paramMap.get("id")!
    return httpService.getList(listId)
}
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router"
import { WordList } from "../../models/wordlist"
import { inject } from "@angular/core"
import HttpService from "../../http.service"
import { catchError, map, of } from "rxjs"

export interface WordListResolverResult {
    data: WordList | null
    error: any
}

export const wordlistResolver: ResolveFn<WordListResolverResult> = (route: ActivatedRouteSnapshot) => {
    const httpService = inject(HttpService)
    const listId = route.paramMap.get("id")!
    return httpService.getList$(listId).pipe(
        map(result => ({
            data: result.list,
            error: null
        })),
        catchError(error => {
            console.log(error)
            return of({
                data: null,
                error: error
            })
        })
    )
}
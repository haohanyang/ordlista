import { inject } from "@angular/core"
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router"
import { catchError, map, of } from "rxjs"
import { WordList } from "src/app/lib/model"
import HttpService from "src/app/service/http.service"

export interface WordListResolverResult {
    data: WordList | null
    error: string | null
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
                error: "Failed to load the list"
            })
        })
    )
}
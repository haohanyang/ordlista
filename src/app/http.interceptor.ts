import { Injectable } from '@angular/core'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'
import { Observable, from } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { Auth } from 'aws-amplify'

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    private readonly baseUrl: string
    constructor() {
        this.baseUrl = import.meta.env.NG_APP_API_BASE_URL
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.startsWith(this.baseUrl)) {
            return from(Auth.currentSession().then(session => session.getIdToken().getJwtToken()).catch(error => ""))
                .pipe(
                    switchMap(token => {
                        if (token) {
                            return next.handle(req.clone({ setHeaders: { Authorization: token } }))
                        }
                        return next.handle(req)
                    })
                )
        }
        return next.handle(req)
    }
}
import { Injectable } from '@angular/core'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'
import { Observable, from } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { Auth } from 'aws-amplify'

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
}
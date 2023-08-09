import { Injectable } from "@angular/core"
import { User } from "./models/user"
import { WordList } from "./models/wordlist"
import { Word } from "./models/word"
import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { Observable, catchError, map, of, switchMap } from "rxjs"
import AuthService from "./auth.service"

export interface HttpServiceResponse<T> {
  data: T | null
  error: string | null
}

@Injectable({
  providedIn: "root"
})
export default class HttpService {
  private baseUrl: string
  constructor(private http: HttpClient, private authService: AuthService) {
    this.baseUrl = "https://18mglttted.execute-api.eu-north-1.amazonaws.com/test"
  }

  handleError<T>(error: HttpErrorResponse): Observable<HttpServiceResponse<T>> {
    if (error.status === 0) {
      console.error(error)
      return of({ data: null, error: "Network error" })
    } else {
      console.error(error)
      return of({ data: null, error: error.message })
    }
  }

  getUserProfile(userId: string) {
    return this.authService.getIdToken().pipe(switchMap(idToken => {
      return this.http.get<{ user: User }>(`${this.baseUrl}/users/${userId}/profile`, {
        headers: {
          Authorization: idToken
        }
      })
        .pipe(map(result => {
          const data: HttpServiceResponse<User> = { data: result.user, error: null }
          return data
        }), catchError(this.handleError<User>))
    }))
  }

  getList(listId: string) {
    return this.authService.getIdToken().pipe(switchMap(idToken => {
      return this.http.get<{ list: WordList }>(`${this.baseUrl}/lists/${listId}`, {
        headers: {
          Authorization: idToken
        }
      })
        .pipe(map(result => {
          const data: HttpServiceResponse<WordList> = { data: result.list, error: null }
          return data
        }), catchError(this.handleError<WordList>))
    }))
  }

  getLists(userId: string) {
    return this.authService.getIdToken().pipe(switchMap(idToken => {
      return this.http.get<{ lists: WordList[] }>(`${this.baseUrl}/users/${userId}/lists`, {
        headers: {
          Authorization: idToken
        }
      })
        .pipe(map(result => {
          const data: HttpServiceResponse<WordList[]> = { data: result.lists, error: null }
          return data
        }), catchError(this.handleError<WordList[]>))
    }))
  }

  createList(list: WordList) {
    return this.authService.getIdToken().pipe(switchMap(idToken => {
      return this.http.post<{ list: WordList }>(`${this.baseUrl}/lists`, list, {
        headers: {
          Authorization: idToken
        }
      })
        .pipe(map(result => {
          const data: HttpServiceResponse<WordList> = { data: result.list, error: null }
          return data
        }), catchError(this.handleError<WordList>))
    }))

  }

  deleteList(listId: string) {
    return this.authService.getIdToken().pipe(switchMap(idToken => {
      return this.http.delete<{ message: string }>(`${this.baseUrl}/lists/${listId}`, {
        headers: {
          Authorization: idToken
        }
      })
        .pipe(map(result => {
          const data: HttpServiceResponse<string> = { data: result.message, error: null }
          return data
        }), catchError(this.handleError<string>))
    }))
  }

  updateList(list: WordList) {
    return this.authService.getIdToken().pipe(switchMap(idToken => {
      return this.http.patch<{ list: WordList }>(`${this.baseUrl}/lists/${list.id}`, list, {
        headers: {
          Authorization: idToken
        }
      })
        .pipe(map(result => {
          const data: HttpServiceResponse<WordList> = { data: result.list, error: null }
          return data
        }), catchError(this.handleError<WordList>))
    }))
  }

  getWords(listId: string) {
    return this.authService.getIdToken().pipe(switchMap(idToken => {
      return this.http.get<{ words: Word[] }>(`${this.baseUrl}/lists/${listId}/words`, {
        headers: {
          Authorization: idToken
        }
      })
        .pipe(map(result => {
          const data: HttpServiceResponse<Word[]> = { data: result.words, error: null }
          return data
        }), catchError(this.handleError<Word[]>))
    }))
  }

  createWord(word: Word) {
    return this.authService.getIdToken().pipe(switchMap(idToken => {
      return this.http.post<{ word: Word }>(`${this.baseUrl}/words`, word, {
        headers: {
          Authorization: idToken
        }
      })
        .pipe(map(result => {
          const data: HttpServiceResponse<Word> = { data: result.word, error: null }
          return data
        }), catchError(this.handleError<Word>))
    }))
  }

  updateWord(word: Word) {
    return this.authService.getIdToken().pipe(switchMap(idToken => {
      return this.http.patch<{ word: Word }>(`${this.baseUrl}/words/${word.id}`, word, {
        headers: {
          Authorization: idToken
        }
      })
        .pipe(map(result => {
          const data: HttpServiceResponse<Word> = { data: result.word, error: null }
          return data
        }), catchError(this.handleError<Word>))
    }))
  }

  deleteWord(wordId: string) {
    return this.authService.getIdToken().pipe(switchMap(idToken => {
      return this.http.delete<{ message: string }>(`${this.baseUrl}/words/${wordId}`, {
        headers: {
          Authorization: idToken
        }
      })
        .pipe(map(result => {
          const data: HttpServiceResponse<string> = { data: result.message, error: null }
          return data
        }), catchError(this.handleError<string>))
    }))
  }

  searchWord(keyword: string) {
    return this.authService.getIdToken().pipe(switchMap(idToken => {
      return this.http.post<{ result: Word[] }>(`${this.baseUrl}/search`, {
        "keyword": keyword
      }, {
        headers: {
          Authorization: idToken
        }
      })
        .pipe(map(result => {
          const data: HttpServiceResponse<Word[]> = { data: result.result, error: null }
          return data
        }), catchError(this.handleError<Word[]>))
    }))
  }
}

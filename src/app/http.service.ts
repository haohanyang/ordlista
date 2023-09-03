import { Injectable } from "@angular/core"
import { User } from "./models/user"
import { WordList } from "./models/wordlist"
import { Word } from "./models/word"
import { HttpClient } from "@angular/common/http"
import { switchMap } from "rxjs"
import AuthService from "./auth.service"

@Injectable({
  providedIn: "root"
})
export default class HttpService {
  private baseUrl: string
  constructor(private http: HttpClient, private authService: AuthService) {
    this.baseUrl = import.meta.env.NG_APP_API_BASE_URL
  }

  getUserProfile$(userId: string) {
    return this.authService.idTokenSubject$.pipe(switchMap(idToken =>
      this.http.get<{ user: User }>(`${this.baseUrl}/users/${userId}/profile`, {
        headers: {
          Authorization: idToken
        }
      })
    ))
  }

  getList$(listId: string) {
    return this.authService.idTokenSubject$.pipe(switchMap(idToken =>
      this.http.get<{ list: WordList }>(`${this.baseUrl}/lists/${listId}`, {
        headers: {
          Authorization: idToken
        }
      })
    ))
  }

  getLists$(userId: string) {
    return this.authService.idTokenSubject$.pipe(switchMap(idToken =>
      this.http.get<{ lists: WordList[] }>(`${this.baseUrl}/users/${userId}/lists`, {
        headers: {
          Authorization: idToken
        }
      })
    ))
  }

  createList$(list: WordList) {
    return this.authService.idTokenSubject$.pipe(switchMap(idToken =>
      this.http.post<{ list: WordList }>(`${this.baseUrl}/lists`, list, {
        headers: {
          Authorization: idToken
        }
      })
    ))
  }

  deleteList$(listId: string) {
    return this.authService.idTokenSubject$.pipe(switchMap(idToken =>
      this.http.delete<{ message: string }>(`${this.baseUrl}/lists/${listId}`, {
        headers: {
          Authorization: idToken
        }
      })
    ))
  }

  updateList$(list: WordList) {
    return this.authService.idTokenSubject$.pipe(switchMap(idToken =>
      this.http.patch<{ list: WordList }>(`${this.baseUrl}/lists/${list.id}`, list, {
        headers: {
          Authorization: idToken
        }
      })
    ))
  }

  getWords$(listId: string) {
    return this.authService.idTokenSubject$.pipe(switchMap(idToken =>
      this.http.get<{ words: Word[] }>(`${this.baseUrl}/lists/${listId}/words`, {
        headers: {
          Authorization: idToken
        }
      })
    ))
  }

  createWord$(word: Word) {
    return this.authService.idTokenSubject$.pipe(switchMap(idToken =>
      this.http.post<{ word: Word }>(`${this.baseUrl}/words`, word, {
        headers: {
          Authorization: idToken
        }
      })
    ))
  }

  updateWord$(word: Word) {
    return this.authService.idTokenSubject$.pipe(switchMap(idToken =>
      this.http.patch<{ word: Word }>(`${this.baseUrl}/words/${word.id}`, word, {
        headers: {
          Authorization: idToken
        }
      })
    ))
  }

  deleteWord$(wordId: string) {
    return this.authService.idTokenSubject$.pipe(switchMap(idToken =>
      this.http.delete<{ message: string }>(`${this.baseUrl}/words/${wordId}`, {
        headers: {
          Authorization: idToken
        }
      })
    ))
  }

  searchWord$(keyword: string) {
    return this.authService.idTokenSubject$.pipe(switchMap(idToken =>
      this.http.post<{ result: Word[] }>(`${this.baseUrl}/search`, {
        "keyword": keyword
      }, {
        headers: {
          Authorization: idToken
        }
      })
    ))
  }
}

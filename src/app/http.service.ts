import { Injectable } from "@angular/core"
import { User } from "./models/user"
import { WordList } from "./models/wordlist"
import { Word } from "./models/word"
import { HttpClient } from "@angular/common/http"
import { map } from "rxjs"

@Injectable({
  providedIn: "root"
})
export default class HttpService {
  private readonly baseUrl: string
  private readonly cdnBaseUrl: string
  constructor(private http: HttpClient) {
    this.baseUrl = import.meta.env.NG_APP_API_BASE_URL
    this.cdnBaseUrl = import.meta.env.NG_APP_CDN_BASE_URL
  }

  getUserProfile$(userId: string) {
    return this.http.get<{ user: User }>(`${this.baseUrl}/users/${userId}/profile`)
  }

  getList$(listId: string) {
    return this.http.get<{ list: WordList }>(`${this.baseUrl}/lists/${listId}`)
  }

  getLists$(userId: string) {
    return this.http.get<{ lists: WordList[] }>(`${this.baseUrl}/users/${userId}/lists`)
  }

  createList$(list: WordList) {
    return this.http.post<{ list: WordList }>(`${this.baseUrl}/lists`, list)
  }

  deleteList$(listId: string) {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/lists/${listId}`)
  }

  updateList$(list: WordList) {
    return this.http.patch<{ list: WordList }>(`${this.baseUrl}/lists/${list.id}`, list)
  }

  getWords$(listId: string) {
    return this.http.get<{ words: Word[] }>(`${this.baseUrl}/lists/${listId}/words`)
  }

  createWord$(word: Word) {
    return this.http.post<{ word: Word }>(`${this.baseUrl}/words`, word)
  }

  updateWord$(word: Word) {
    return this.http.patch<{ word: Word }>(`${this.baseUrl}/words/${word.id}`, word)
  }

  deleteWord$(wordId: string) {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/words/${wordId}`)
  }

  searchWord$(keyword: string) {
    return this.http.post<{ result: Word[] }>(`${this.baseUrl}/search`, { "keyword": keyword })
  }

  getPreSignedUploadUrl$(contentType: string) {
    return this.http.post<{ url: string, fields: object }>(`${this.baseUrl}/presigned-url`, {
      "contentType": contentType
    })
  }

  uploadFile$(url: string, fields: any, file: File) {
    const formData = new FormData()
    formData.append("Content-Type", file.type)
    Object.keys(fields).forEach(key => {
      formData.append(key, fields[key])
    })
    formData.append("file", file)

    return this.http.post(url, formData,
      { responseType: "text" }
    ).pipe(map(result => {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(result, "text/xml")
      const rootElement = xmlDoc.documentElement
      const keyElement = rootElement.getElementsByTagName("Key")[0]
      return `${this.cdnBaseUrl}/${keyElement.firstChild?.nodeValue || ""}`
    }))
  }

  updateUsername$(userId: string, username: string) {
    return this.http.patch(`${this.baseUrl}/users/${userId}/profile`,
      { username: username }
    )
  }

  updateBio$(userId: string, bio: string) {
    return this.http.patch(`${this.baseUrl}/users/${userId}/profile`,
      { bio: bio }
    )
  }
}

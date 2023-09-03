import { Component, OnInit } from "@angular/core"
import HttpService from "../../http.service"
import { WordList } from "../../models/wordlist"
import { Observable, catchError, map, of, switchMap, tap } from "rxjs"
import { Router } from "@angular/router"
import { MatDialog } from "@angular/material/dialog"
import { SaveListModalComponent, SaveListModalData } from "src/app/components/save-list-modal/save-list-modal.component"
import * as moment from "moment"
import AuthService from "src/app/auth.service"

class WordListGroupNode {

  isHeader: boolean = false
  date: moment.Moment
  lists: WordList[]
  next: WordListGroupNode | null

  constructor(list: WordList) {
    this.isHeader = false
    this.date = moment(list.createdAt)
    this.lists = [list]
    this.next = null
  }

  static dummy() {
    const list: WordListGroupNode = {
      isHeader: true,
      date: moment(),
      lists: [],
      next: null
    }
    return list
  }
}

@Component({
  selector: "app-wordlists",
  templateUrl: "./wordlists.component.html",
})
export class WordlistsComponent implements OnInit {
  fetchingError: string | null = null
  wordLists$: Observable<WordListGroupNode | null>

  constructor(public auth: AuthService, private router: Router,
    private httpService: HttpService, private dialog: MatDialog) {
    this.onNewListCreated = this.onNewListCreated.bind(this)
  }

  ngOnInit() {
    this.wordLists$ = this.auth.userIdSubject$.pipe(
      switchMap(userId => this.httpService.getLists$(userId!)),
      map(result => {
        const wordLists = result.lists
        let header: WordListGroupNode = WordListGroupNode.dummy()
        let cur: WordListGroupNode = header
        for (let i = wordLists.length - 1; i >= 0; i--) {
          if (!cur.isHeader && cur.date.isSame(wordLists[i].createdAt, "month")) {
            cur.lists.push(wordLists[i])
          } else {
            cur.next = new WordListGroupNode(wordLists[i])
            cur = cur.next
          }
        }
        return header
      }),
      catchError(err => {
        this.fetchingError = "Failed to load word lists"
        console.log(err)
        return of(null)
      })
    )
  }

  formatDate(date: string) {
    return moment(date).format("MMMM, YYYY")
  }

  wordLists(wordListNodeHeader: WordListGroupNode) {
    let cur: WordListGroupNode | null = wordListNodeHeader.next
    const wordLists: WordList[][] = []
    while (cur) {
      wordLists.push(cur.lists)
      cur = cur.next
    }
    return wordLists
  }

  sameMonth(date1: string, date2: string) {
    return moment(date1).isSame(moment(date2), "month")
  }

  openCreateListModal() {
    this.dialog.open<SaveListModalComponent, SaveListModalData>(SaveListModalComponent, {
      width: "400px",
      data: {
        list: null,
        onSuccessCallback: this.onNewListCreated,
        userId: this.auth.userIdSubject$.value!
      }
    })
  }

  onNewListCreated(list: WordList) {
    this.router.navigate(["/lists", list.id])
  }
}

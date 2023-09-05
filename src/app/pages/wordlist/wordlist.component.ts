import { Component, ElementRef, OnInit, ViewChild } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import HttpService from "../../http.service"
import { Word } from "../../models/word"
import { WordList } from "../../models/wordlist"
import { BehaviorSubject, catchError, map, of, switchMap, tap } from "rxjs"

import AuthService from "src/app/auth.service"
import { MatBottomSheet } from "@angular/material/bottom-sheet"
import { AddWordSheetComponent, AddWordSheetData } from "src/app/components/add-word-sheet/add-word-sheet.component"
import { MatDialog } from "@angular/material/dialog"
import { SaveListModalComponent, SaveListModalData } from "src/app/components/save-list-modal/save-list-modal.component"
import { DeleteModalComponent, DeleteModalData } from "src/app/components/delete-modal/delete-modal.component"
import { Title } from "@angular/platform-browser"
import moment from "moment"

@Component({
  selector: "app-wordlist",
  templateUrl: "./wordlist.component.html"
})
export class WordlistComponent implements OnInit {
  list: WordList | null = null
  listError: string | null = null

  words: Word[] | null = null
  isFetchingWords = false
  fetchingWordsError: string | null = null

  tableView = false
  displayedColumns: string[] = ['swedishWord', 'translation'];

  @ViewChild("listBottom") listBottom?: ElementRef
  @ViewChild("listTop") listTop?: ElementRef


  constructor(private activatedRoute: ActivatedRoute, private httpService: HttpService,
    public auth: AuthService, private router: Router, private bottomSheet: MatBottomSheet,
    private dialog: MatDialog, private titleService: Title) {
    this.addWord = this.addWord.bind(this)
    this.updateWord = this.updateWord.bind(this)
    this.deleteWord = this.deleteWord.bind(this)
    this.onListUpdated = this.onListUpdated.bind(this)
    this.onListDeleted = this.onListDeleted.bind(this)
    this.closeBottomSheet = this.closeBottomSheet.bind(this)
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ listResult }) => {
      if (listResult.error) {
        this.listError = "Failed to load the list"
      } else {
        this.list = listResult.data
      }
    })

    if (this.list) {
      this.isFetchingWords = true
      this.httpService.getWords$(this.list.id).subscribe(
        {
          next: result => {
            this.words = result.words,
              this.isFetchingWords = false
          },
          error: err => {
            console.log(err)
            this.fetchingWordsError = "Failed to load words"
            this.isFetchingWords = false
          },
        }
      )
    }
  }

  formatDate(date: string) {
    return moment(date).format("D MMM, YYYY")
  }

  scrollToTop() {
    this.listTop?.nativeElement.scrollIntoView({ behavior: "smooth" })
  }

  scrollToBottom() {
    this.listBottom?.nativeElement.scrollIntoView({ behavior: "smooth" })
  }

  closeBottomSheet() {
    this.bottomSheet.dismiss()
  }

  openButtomSheet() {
    if (this.list) {
      this.bottomSheet.open<AddWordSheetComponent, AddWordSheetData>(AddWordSheetComponent, {
        data: {
          listId: this.list.id,
          userId: this.auth.userIdSubject$.value!,
          addWordCallback: this.addWord,
          closeBottomSheet: this.closeBottomSheet,
        }
      })
    }
  }

  openEditListModal() {
    if (this.list) {
      this.dialog.open<SaveListModalComponent, SaveListModalData>(SaveListModalComponent, {
        width: "400px",
        data: {
          list: this.list,
          onSuccessCallback: this.onListUpdated,
          userId: this.auth.userIdSubject$.value!
        }
      })
    }
  }

  openDeleteListModal() {
    if (this.list) {
      this.dialog.open<DeleteModalComponent, DeleteModalData>(DeleteModalComponent, {
        width: "400px",
        data: {
          onSuccessCallback: this.onListDeleted,
          dataName: this.list.name,
          dataType: "list",
          dataId: this.list.id
        }
      })
    }
  }

  addWord(word: Word) {
    this.words?.push(word)
  }

  updateWord(word: Word) {
    this.words = this.words?.map(w => w.id === word.id ? word : w) || null
  }

  deleteWord(wordId: string) {
    this.words = this.words?.filter(w => w.id !== wordId) || null
  }

  onListUpdated(list: WordList) {
    this.list = list
  }

  onListDeleted() {
    this.router.navigate(["/my-lists"])
  }
}

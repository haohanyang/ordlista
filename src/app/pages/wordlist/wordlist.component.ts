import { Component, ElementRef, OnInit, ViewChild } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import HttpService from "../../http.service"
import { Word } from "../../models/word"
import { WordList } from "../../models/wordlist"
import { BehaviorSubject, catchError, map, of, switchMap } from "rxjs"

import AuthService from "src/app/auth.service"
import { MatBottomSheet } from "@angular/material/bottom-sheet"
import { AddWordSheetComponent, AddWordSheetData } from "src/app/components/add-word-sheet/add-word-sheet.component"
import { MatDialog } from "@angular/material/dialog"
import { SaveListModalComponent, SaveListModalData } from "src/app/components/save-list-modal/save-list-modal.component"
import { DeleteModalComponent, DeleteModalData } from "src/app/components/delete-modal/delete-modal.component"
import { Title } from "@angular/platform-browser"

@Component({
  selector: "app-wordlist",
  templateUrl: "./wordlist.component.html"
})
export class WordlistComponent implements OnInit {
  list$ = new BehaviorSubject<WordList | null>(null)
  listError: string | null = null

  words$ = new BehaviorSubject<Word[] | null>(null)
  fetchingWordsError: string | null = null

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
        this.titleService.setTitle("Error")
        this.listError = "Failed to load list"
      } else {
        this.titleService.setTitle(listResult.data.name)
        this.list$.next(listResult.data)
      }
    })

    this.activatedRoute.data.pipe(
      switchMap(({ listResult }) => this.httpService.getWords$(listResult.data.id)),
      map(result => result.words),
      catchError(err => {
        console.log(err)
        return of(null)
      })
    ).subscribe(words => {
      if (words) {
        this.words$.next(words)
      } else {
        this.fetchingWordsError = "Failed to load words"
      }
    })
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
    this.bottomSheet.open<AddWordSheetComponent, AddWordSheetData>(AddWordSheetComponent, {
      data: {
        listId: this.list$.value!.id,
        userId: this.auth.userIdSubject$.value!,
        addWordCallback: this.addWord,
        closeBottomSheet: this.closeBottomSheet,
      }
    })
  }

  openEditListModal() {
    if (this.list$.value) {
      this.dialog.open<SaveListModalComponent, SaveListModalData>(SaveListModalComponent, {
        width: "400px",
        data: {
          list: this.list$.value,
          onSuccessCallback: this.onListUpdated,
          userId: this.auth.userIdSubject$.value!
        }
      })
    }
  }

  openDeleteListModal() {
    if (this.list$.value) {
      this.dialog.open<DeleteModalComponent, DeleteModalData>(DeleteModalComponent, {
        width: "400px",
        data: {
          onSuccessCallback: this.onListDeleted,
          dataName: this.list$.value!.name || "",
          dataType: "list",
          dataId: this.list$.value!.id
        }
      })
    }
  }

  addWord(word: Word) {
    this.words$.next(this.words$.value ? [...this.words$.value, word] : [word])
  }

  updateWord(word: Word) {
    this.words$.next(this.words$.value?.map(w => w.id === word.id ? word : w) || null)
  }

  deleteWord(wordId: string) {
    this.words$.next(this.words$.value?.filter(w => w.id !== wordId) || null)
  }

  onListUpdated(list: WordList) {
    this.list$.next(list)
  }

  onListDeleted() {
    // this.dialog.closeAll()
    this.router.navigate(["/my-lists"])
  }
}

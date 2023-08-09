import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import HttpService from "../../http.service"
import { Word } from "../../models/word"
import { WordList } from "../../models/wordlist"
import { Subscription, of, switchMap } from "rxjs"

@Component({
  selector: "app-wordlist",
  templateUrl: "./wordlist.component.html"
})
export class WordlistComponent implements OnInit, OnDestroy {
  // Pre-fetched data
  userId: string | null = null
  list: WordList | null = null
  listError: string | null = null

  words: Word[] | null = null
  isFetchingWords = false
  fetchingWordsError: string | null = null

  isEditingNewWord = false

  subscription: Subscription | null = null

  dropdownMenuOpen = false

  deleteListModalOpen = false
  editListModalOpen = false
  searchWordModalOpen = false

  constructor(private activatedRoute: ActivatedRoute, private httpService: HttpService, private router: Router) {
    this.addWord = this.addWord.bind(this)
    this.updateWord = this.updateWord.bind(this)
    this.deleteWord = this.deleteWord.bind(this)
    this.closeDeleteListModal = this.closeDeleteListModal.bind(this)
    this.closeEditListModal = this.closeEditListModal.bind(this)
    this.onListUpdated = this.onListUpdated.bind(this)
    this.onListDeleted = this.onListDeleted.bind(this)
    this.closeSearchWordModal = this.closeSearchWordModal.bind(this)
  }

  ngOnInit() {
    // Get pre-fetched data from resolver
    this.subscription = this.activatedRoute.data.pipe(switchMap(({ userId, listInfo }) => {
      this.userId = userId
      if (userId && listInfo.data) {
        this.list = listInfo.data
        this.isFetchingWords = true
        return this.httpService.getWords(listInfo.data.id)
      }
      this.listError = listInfo.error
      return of(null)
    })).subscribe(result => {
      if (result) {
        this.words = result.data
      }
      this.isFetchingWords = false
    })
  }

  addWord(word: Word, isImported: boolean = false) {
    this.words?.push(word)
    if (!isImported) {
      this.isEditingNewWord = false
    }
  }

  updateWord(word: Word) {
    this.words = this.words?.map(w => w.id === word.id ? word : w) || null
  }

  deleteWord(wordId: string) {
    this.words = this.words?.filter(w => w.id !== wordId) || null
  }

  closeEditListModal() {
    this.editListModalOpen = false
  }

  closeDeleteListModal() {
    this.deleteListModalOpen = false
  }

  closeSearchWordModal() {
    this.searchWordModalOpen = false
  }

  onListUpdated(list: WordList) {
    this.list!.name = list.name
    this.list!.description = list.description
    this.editListModalOpen = false
  }

  onListDeleted() {
    this.deleteListModalOpen = false
    this.router.navigate(["/mina-listor"])
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }
}

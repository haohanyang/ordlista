import { Component, Input, OnInit } from "@angular/core"
import { FormArray, FormControl, FormGroup } from "@angular/forms"
import { Word } from "../../models/word"
import HttpService from "../../http.service"

@Component({
  selector: "app-word-card",
  templateUrl: "./word-card.component.html",
  styleUrls: ["./word-card.component.scss"]
})
export class WordCardComponent implements OnInit {
  @Input() word: Word
  @Input() isNewWord = false
  @Input() userId: string
  @Input() listId: string
  @Input() submitCallback: (word: Word) => void
  @Input() deleteCallback: (id: string) => void

  isEditMode = false;

  wordForm: FormGroup

  isSaving = false
  savingError: string | null = null

  dropdownMenuOpen = false
  deleteWordModalOpen = false

  constructor(private httpService: HttpService) {
    this.closeDeleteWordModal = this.closeDeleteWordModal.bind(this)
    this.onWordDeleted = this.onWordDeleted.bind(this)
  }

  ngOnInit() {
    if (this.isNewWord) {
      this.word = {
        id: "",
        swedishWord: "",
        category: "substantiv",
        translation: "",
        audioUrl: "",
        inflections: "",
        examples: [],
        createdAt: "",
        lastModifiedAt: "",
        synonyms: "",
        listId: this.listId,
        creatorId: this.userId
      }
    }

    this.wordForm = new FormGroup({
      swedishWord: new FormControl(this.word.swedishWord),
      category: new FormControl(this.word.category),
      translation: new FormControl(this.word.translation),
      audioUrl: new FormControl(this.word.audioUrl),
      inflections: new FormControl(this.word.inflections),
      synonyms: new FormControl(this.word.synonyms),
      examples: new FormArray<FormControl>(
        this.word.examples.map(example => new FormControl(example)))
    })
  }

  get swedishWord() {
    return this.wordForm.get("swedishWord") as FormControl<string>
  }

  get category() {
    return this.wordForm.get("category") as FormControl<string>
  }

  get translation() {
    return this.wordForm.get("translation") as FormControl<string>
  }

  get audioUrl() {
    return this.wordForm.get("audioUrl") as FormControl<string>
  }

  get inflections() {
    return this.wordForm.get("inflections") as FormControl<string>
  }

  get examples() {
    return this.wordForm.get("examples") as FormArray
  }

  genAudioUrl() {
    if (this.swedishWord.value) {
      this.audioUrl.setValue(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=sv&q=${this.swedishWord.value}&total=1&idx=0&textlen=${this.swedishWord.value.length}`)
    }
  }

  addExample() {
    this.examples.push(new FormControl(""))
  }

  removeExample(index: number) {
    this.examples.removeAt(index)
  }

  playAudio(url: string | null) {
    if (url) {
      let audio = new Audio(url)
      audio.setAttribute("type", "audio/mpeg")
      audio.play()
    }
  }

  onWordDeleted() {
    this.deleteCallback(this.word.id)
    this.deleteWordModalOpen = false
  }

  saveWord() {
    this.isSaving = true
    const request = this.isNewWord ? this.httpService.createWord({ ...this.wordForm.value, creatorId: this.userId, listId: this.listId, id: this.word.id })
      : this.httpService.updateWord({ ...this.wordForm.value, creatorId: this.userId, listId: this.listId, id: this.word.id })
    request.subscribe(result => {
      if (result.error) {
        this.savingError = "Error saving word"
        console.error(result.error)
      } else {
        this.submitCallback(result.data!)
      }
      if (!this.isNewWord) {
        this.isEditMode = false
      }
      this.isSaving = false
    })
  }

  closeDeleteWordModal() {
    this.deleteWordModalOpen = false
  }
}

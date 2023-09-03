import { Component, Input } from "@angular/core"
import { FormGroup } from "@angular/forms"
import { Word } from "../../models/word"
import HttpService from "../../http.service"
import { MatDialog } from "@angular/material/dialog"
import { SaveWordModalComponent, SaveWordModalData } from "../save-word-modal/save-word-modal.component"
import { DeleteModalComponent, DeleteModalData } from "../delete-modal/delete-modal.component"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-word-card",
  templateUrl: "./word-card.component.html",
})
export class WordCardComponent {
  @Input() word: Word
  @Input() isNewWord = false
  @Input() userId: string
  @Input() listId: string
  @Input() submitCallback: (word: Word) => void
  @Input() deleteCallback: (id: string) => void

  wordForm: FormGroup

  isSaving = false
  savingError: string | null = null

  dropdownMenuOpen = false
  deleteWordModalOpen = false

  constructor(private httpService: HttpService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.closeDeleteWordModal = this.closeDeleteWordModal.bind(this)
    this.onWordDeleted = this.onWordDeleted.bind(this)
  }

  openSaveWordModal() {
    this.dialog.open<SaveWordModalComponent, SaveWordModalData>(SaveWordModalComponent, {
      width: "400px",
      data: {
        word: this.word,
        listId: this.listId,
        userId: this.userId,
        submitCallback: this.submitCallback
      }
    })
  }

  openDeleteWordModal() {
    this.dialog.open<DeleteModalComponent, DeleteModalData>(DeleteModalComponent, {
      width: "400px",
      data: {
        onSuccessCallback: this.onWordDeleted,
        dataName: this.word.swedishWord,
        dataType: "word",
        dataId: this.word.id
      }
    })
  }

  playAudio() {
    if (this.word.audioUrl) {
      let audio = new Audio(this.word.audioUrl)
      audio.setAttribute("type", "audio/mpeg")
      audio.play()
    }
  }

  onWordDeleted() {
    this.deleteCallback(this.word.id)
  }

  closeDeleteWordModal() {
    this.deleteWordModalOpen = false
  }
}

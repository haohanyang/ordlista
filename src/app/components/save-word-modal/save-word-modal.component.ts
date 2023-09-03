import { Component, Inject, OnInit } from "@angular/core"
import { FormArray, FormControl, FormGroup } from "@angular/forms"
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"
import { MatSnackBar } from "@angular/material/snack-bar"
import HttpService from "src/app/http.service"
import { Word } from "src/app/models/word"

export interface SaveWordModalData {
    word: Word | null
    listId: string
    userId: string
    submitCallback: (word: Word) => void
}

@Component({
    selector: "app-save-word-modal",
    templateUrl: "./save-word-modal.component.html"
})
export class SaveWordModalComponent implements OnInit {
    wordForm: FormGroup
    isSaving = false

    constructor(private httpService: HttpService, private snackBar: MatSnackBar, public dialogRef: MatDialogRef<SaveWordModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SaveWordModalData) {
    }

    ngOnInit(): void {
        this.wordForm = new FormGroup({
            swedishWord: new FormControl(this.data.word?.swedishWord || ""),
            category: new FormControl(this.data.word?.category || "substantiv"),
            translation: new FormControl(this.data.word?.translation || ""),
            audioUrl: new FormControl(this.data.word?.audioUrl || ""),
            inflections: new FormControl(this.data.word?.inflections || ""),
            synonyms: new FormControl(this.data.word?.synonyms || ""),
            examples: new FormArray<FormControl>(
                this.data.word ? this.data.word.examples.map(example => new FormControl(example)) : [])
        })
    }

    get swedishWord() {
        return this.wordForm.get("swedishWord") as FormControl
    }

    get examples() {
        return this.wordForm.get("examples") as FormArray
    }

    get audioUrl() {
        return this.wordForm.get("audioUrl") as FormControl
    }

    addExample() {
        this.examples.push(new FormControl(""))
    }

    removeExample(index: number) {
        this.examples.removeAt(index)
    }

    fillAudioUrl() {
        if (this.swedishWord.value) {
            this.audioUrl.setValue(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=sv&q=${this.swedishWord.value}&total=1&idx=0&textlen=${this.swedishWord.value.length}`)
        }
    }

    playAudio() {
        if (this.audioUrl.value) {
            let audio = new Audio(this.audioUrl.value)
            audio.setAttribute("type", "audio/mpeg")
            audio.play()
        }
    }

    saveWord() {
        this.isSaving = true
        const request = this.data.word ? this.httpService.updateWord$({ ...this.wordForm.value, creatorId: this.data.userId, listId: this.data.listId, id: this.data.word.id })
            : this.httpService.createWord$({ ...this.wordForm.value, creatorId: this.data.userId, listId: this.data.listId })
        request.subscribe({
            next: result => {
                this.isSaving = false
                this.dialogRef.close()
                this.data.submitCallback(result.word)
            },
            error: err => {
                this.snackBar.open("Failed to save the word", "Close", {
                    duration: 3000,
                    verticalPosition: "top",
                    horizontalPosition: "right"
                })
                console.log(err)
                this.isSaving = false
            }
        })
    }
}

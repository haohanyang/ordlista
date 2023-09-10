import { Component } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { catchError, map, of, switchMap, tap } from 'rxjs'
import AuthService from 'src/app/auth.service'
import HttpService from 'src/app/http.service'

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
})
export class ProfileSettingsComponent {
  userProfileError: string | null = null
  profileForm: FormGroup = new FormGroup({
    avatar: new FormControl(""),
    username: new FormControl("", []),
    bio: new FormControl("", [])
  })
  isUploadingAvatar = false
  editUsername = false
  editBio = false

  isSavingUsername = false
  isSavingBio = false

  constructor(public http: HttpService, private auth: AuthService, private snackbar: MatSnackBar) {
  }

  userProfile$ = this.auth.userIdSubject$.pipe(switchMap(userId => this.http.getUserProfile$(userId!)),
    map(result => result.user), tap(user => {
      this.profileForm.patchValue({
        avatar: user.avatar,
        username: user.username,
        bio: user.bio
      })
    }), catchError(error => {
      console.log(error)
      this.userProfileError = "Failed to fetch user profile"
      return of(null)
    }))

  get avatar() {
    return this.profileForm.get("avatar")!.value as string
  }

  get username() {
    return this.profileForm.get("username")!.value as string
  }

  set username(value: string) {
    this.profileForm.patchValue({
      username: value
    })
  }

  set bio(value: string) {
    this.profileForm.patchValue({
      bio: value
    })
  }

  get bio() {
    return this.profileForm.get("bio")!.value as string
  }

  uploadAvatar(event: Event) {
    const target = event.currentTarget as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      this.isUploadingAvatar = true
      this.http.getPreSignedUploadUrl$(file.type)
        .pipe(switchMap(result => this.http.uploadFile$(result.url, result.fields, file)))
        .subscribe({
          next: url => {
            this.isUploadingAvatar = false
            this.profileForm.patchValue({
              avatar: url
            })
            this.snackbar.open("Avatar uploaded", "Close")
            console.log(this.avatar)
          },
          error: error => {
            console.log(error)
            this.isUploadingAvatar = false
            this.snackbar.open("Failed to upload avatar", "Close")
          }
        })
    }
  }

  saveUsername() {
    this.isSavingUsername = true
    this.http.updateUsername$(this.auth.userIdSubject$.value!, this.username)
      .subscribe({
        next: () => {
          this.isSavingUsername = false
          this.editUsername = false
          this.snackbar.open("Username updated", "Close")
        },
        error: error => {
          console.log(error)
          this.isSavingUsername = false
          if (error.status === 0) {
            this.snackbar.open("Failed to save the username", "Close")
          }
          else {
            this.snackbar.open(error.error.message, "Close")
          }
        }
      })
  }

  saveBio() {
    this.isSavingBio = true
    this.http.updateBio$(this.auth.userIdSubject$.value!, this.bio)
      .subscribe({
        next: () => {
          this.isSavingBio = false
          this.editBio = false
          this.snackbar.open("Bio updated", "Close")
        },
        error: error => {
          console.log(error)
          this.isSavingBio = false
          if (error.status === 0) {
            this.snackbar.open("Failed to save the bio", "Close")
          }
          else {
            this.snackbar.open(error.error.message, "Close")
          }
        }
      })
  }


}

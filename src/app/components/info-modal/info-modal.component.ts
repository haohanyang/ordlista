import { Component } from '@angular/core'
import packageJson from '../../../../package.json'
import { Octokit } from '@octokit/rest'
import { catchError, from, map, of } from 'rxjs'

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html'
})
export class InfoModalComponent {
  octokit = new Octokit()
  appVersion = packageJson.version
  commitHash = import.meta.env.NG_APP_COMMIT_HASH
  commitBranch = import.meta.env.NG_APP_COMMIT_BRANCH

  branchInfo$ = from(this.octokit.repos.getBranch({
    owner: 'haohanyang',
    repo: 'ordlista',
    branch: this.commitBranch
  })).pipe(map(res => res.data), catchError(error => {
    console.error(error)
    return of(null)
  }))

  commitInfo$ = from(this.octokit.repos.getCommit({
    owner: 'haohanyang',
    repo: 'ordlista',
    ref: this.commitHash
  })).pipe(map(res => res.data), catchError(error => {
    console.log(error)
    return of(null)
  }))

  buildInfo$ = from(this.octokit.actions.listWorkflowRunsForRepo({
    owner: 'haohanyang',
    repo: 'ordlista',
    branch: this.commitBranch,
    head_sha: this.commitHash
  })).pipe(map(res => res.data), catchError(error => {
    console.log(error)
    return of(null)
  }))
}

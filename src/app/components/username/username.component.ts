import { Component, OnInit } from '@angular/core';

import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { CharadesService } from 'src/app/services/charades/charades.service';
import { sessionEvents } from 'src/app/services/charades/events/sessionEvents';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent implements OnInit {
  codeForm: FormControl;

  setNameIsDisabled: boolean;

  constructor(private router: Router, private charadesService: CharadesService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.codeForm = new FormControl('', [Validators.required]);

    this.setNameIsDisabled = false;
  }

  getErrorMessage() {
    if(this.codeForm.hasError('required'))
      return 'Name Is Required';
  }

  setName(name: string) {    
    this.setNameIsDisabled = true;

    let timeout = setTimeout(() => {this.failure('Error Performing This Operation. Please Try Again.')}, 2000);

    const subscription = this.charadesService.sessionSubject.subscribe(session => {
      clearTimeout(timeout);
      subscription.unsubscribe();

      switch(session) {
        case sessionEvents.continue:
          this.router.navigate(['/', `${this.charadesService.session.sessionId}`, `${this.charadesService.session.user.username}`]);
          break;
          
        case sessionEvents.error:
          this.failure('Name already taken. Please choose another.');
          break;
      }
    });

    this.charadesService.emitEvents.setUsername(name);
  }

  shareLink() {
    const navigator: any = window.navigator;
    const shareLink: any = {
      title: 'Charades Link',
      url: this.router.url,
    };

    if(navigator && navigator.canShare(shareLink)) {
      navigator.share(shareLink)
        .catch((err) => this.failure('Error Sharing'));
    } else {
      this.failure('Your device does not support sharing.')
    }
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href);
    this.failure('Link Copied to Clipboard')
  }

  failure(message: string) {
    this.snackBar.open(message, 'Dismiss', { duration: 2000 });
    this.setNameIsDisabled = false;
  }

}

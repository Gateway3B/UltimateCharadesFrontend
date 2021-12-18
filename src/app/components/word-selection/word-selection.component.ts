import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CharadesService } from 'src/app/services/charades/charades.service';
import { sessionEvents } from 'src/app/services/charades/events/sessionEvents';
import { team } from 'src/app/services/charades/objects/team';

enum status {
  ready = 'check_circle',
  notReady = 'cancel'
}

enum button {
  ready = 'Ready',
  unReady = 'UnReady'
}

@Component({
  selector: 'app-word-selection',
  templateUrl: './word-selection.component.html',
  styleUrls: ['./word-selection.component.scss']
})
export class WordSelectionComponent implements OnInit {

  words: string[];
  addWordIsDisabled: boolean;
  deleteWordIsDisabled: boolean;
  toggleReadyIsDisabled: boolean;

  team: team;
  codeForm: FormControl;

  teamOneStatus: status;
  teamTwoStatus: status;

  readyText: button;

  constructor(private router: Router, private charadesService: CharadesService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.codeForm = new FormControl('', [Validators.required]);

    this.populateWords();

    this.team = this.charadesService.session.users.get(this.charadesService.session.userId).team;

    this.addWordIsDisabled = false;
    this.deleteWordIsDisabled = false;
    this.toggleReadyIsDisabled = false;

    this.teamOneStatus = status.notReady;
    this.teamTwoStatus = status.notReady;
    this.readyText = button.ready;

    const subscription = this.charadesService.sessionSubject.subscribe(sessionEvent => {
      switch(sessionEvent) {
        case sessionEvents.usToggle:

          if(this.team === team.one)
            this.teamOneStatus = this.charadesService.session.ready[0]?status.ready:status.notReady;
          else
            this.teamTwoStatus = this.charadesService.session.ready[1]?status.ready:status.notReady;
          
          if(this.charadesService.session.ready[this.team - 1]) {
            this.addWordIsDisabled = true;
            this.deleteWordIsDisabled = true;
            this.readyText = button.unReady;
          } else {
            this.addWordIsDisabled = false;
            this.deleteWordIsDisabled = false;
            this.readyText = button.ready;
          }

          this.toggleReadyIsDisabled = false;
          break;

        case sessionEvents.themToggle:
          if(this.team === team.one)
            this.teamTwoStatus = this.charadesService.session.ready[1]?status.ready:status.notReady;
          else
            this.teamOneStatus = this.charadesService.session.ready[0]?status.ready:status.notReady;
          break;

        case sessionEvents.update:
          this.populateWords();
          break;

        case sessionEvents.continue:
          subscription.unsubscribe();
          this.router.navigate(['/', `${this.charadesService.session.sessionId}`, `${this.charadesService.session.user.username}`, 'charades'], { skipLocationChange: true});
          break;
      }
    });
  }

  populateWords() {
    this.words = this.charadesService.session.words;
  }

  getErrorMessage() {
    if(this.codeForm.hasError('required'))
      return 'Word Can\'t Be Blank';
  }

  addWord(word: string) {    
    this.addWordIsDisabled = true;

    let timeout = setTimeout(() => {
      this.failure('Error Performing This Operation. Please Try Again.');
      this.addWordIsDisabled = false;
    }, 2000);

    const subscription = this.charadesService.sessionSubject.subscribe(sessionEvent => {
      clearTimeout(timeout);
      subscription.unsubscribe();

      switch(sessionEvent) {
        case sessionEvents.update:
          this.addWordIsDisabled = false;
          break;

        case sessionEvents.error:
          this.failure('This word has already been added.');
          this.addWordIsDisabled = false;
          break;
      }
    });

    this.charadesService.emitEvents.addWord(word);
  }

  deleteWord(word: string) {
    this.deleteWordIsDisabled = true;

    let timeout = setTimeout(() => {
      this.failure('Error Performing This Operation. Please Try Again.');
      this.deleteWordIsDisabled = false;
    }, 2000);

    const subscription = this.charadesService.sessionSubject.subscribe(sessionEvent => {
      clearTimeout(timeout);
      subscription.unsubscribe();

      switch(sessionEvent) {
        case sessionEvents.update:
          this.deleteWordIsDisabled = false;
          break;
      }

    });

    this.charadesService.emitEvents.deleteWord(word);
  }

  toggleReady() {

    this.toggleReadyIsDisabled = true;

    let timeout = setTimeout(() => {
      this.failure('Error Performing This Operation. Please Try Again.');
      this.toggleReadyIsDisabled = false;
    }, 2000);

    const subscription = this.charadesService.sessionSubject.subscribe(session => {

      switch(session) {
        case sessionEvents.usToggle:
          clearTimeout(timeout);
          subscription.unsubscribe();
          this.toggleReadyIsDisabled = false;
          break;
      }
    });

    this.charadesService.emitEvents.usToggle();
  }

  failure(message: string) {
    this.snackBar.open(message, 'Dismiss', { duration: 2000 });
  }

}

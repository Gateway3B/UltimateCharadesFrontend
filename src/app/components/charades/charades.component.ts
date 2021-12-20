import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CharadesService } from 'src/app/services/charades/charades.service';
import { sessionEvents } from 'src/app/services/charades/events/sessionEvents';
import { team } from 'src/app/services/charades/objects/team';

enum timer {
  startTimer = 'Start Timer',
  stopTimer = 'Stop Timer'
}

@Component({
  selector: 'app-charades',
  templateUrl: './charades.component.html',
  styleUrls: ['./charades.component.scss']
})
export class CharadesComponent implements OnInit {

  team: string;
  username: string;
  word: string;
  timerButtonLabel: string;

  timerButtonIsDisabled: boolean;
  startNextRoundButtonIsDisabled: boolean;
  presenting: boolean;

  time: string;

  constructor(private router: Router, private charadesService: CharadesService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.timerButtonIsDisabled = false;
    this.startNextRoundButtonIsDisabled = true;
    this.updateRound();

    this.setTime();
    this.timerButtonLabel = timer.startTimer;

    const subscription = this.charadesService.sessionSubject.subscribe(sessionEvent => {
      switch(sessionEvent) {
        case(sessionEvents.continue):
          this.updateRound();
          this.timerButtonLabel = timer.startTimer;
          break;

        case(sessionEvents.update):
          this.timerButtonLabel = timer.stopTimer;
          this.setTime();
          break;

        case(sessionEvents.results):
          subscription.unsubscribe();
          this.router.navigate(['/', `${this.charadesService.session.sessionId}`, `${this.charadesService.session.user.username}`, 'results'], { skipLocationChange: true});
          break;
      }
    })
  }

  setTime() {
    const minutes: string = Math.floor(this.charadesService.session.currentTime/60).toString();
    const seconds: string = Math.floor(this.charadesService.session.currentTime%60).toString();
    this.time = `${minutes.length >= 2 ? minutes : `0${minutes}`}m ${seconds.length >= 2 ? seconds : `0${seconds}`}s`;
  }

  updateRound() {
    const player = this.charadesService.session.users.get(this.charadesService.session.currentPlayerId);
    this.team = player.team === team.one ? 'One' : 'Two';
    this.username = player.username;
    this.time = '00m 00s';

    this.presenting = this.charadesService.session.currentPlayerId === this.charadesService.session.userId;

    if(this.presenting) {
      this.word = this.charadesService.session.currentWord;
    }
  }

  timerButtonHit() {
    this.timerButtonIsDisabled = true;
    
    if(this.timerButtonLabel == timer.stopTimer)
      this.charadesService.emitEvents.stopTimer();
    else
      this.charadesService.emitEvents.startTimer();


    let timeout = setTimeout(() => {
      this.timerButtonIsDisabled = false;
      this.failure('Error Performing This Operation. Please Try Again.')
    }, 2000);

    const subscription = this.charadesService.sessionSubject.subscribe(sessionEvent => {
      clearTimeout(timeout);
      subscription.unsubscribe();

      switch(sessionEvent) {
        case sessionEvents.timerStart:
          this.timerButtonLabel = timer.stopTimer;
          break;
          
        case sessionEvents.timerStop:
          this.startNextRoundButtonIsDisabled = false;
          this.timerButtonLabel = timer.startTimer;
          break;
      }

      this.timerButtonIsDisabled = false;
    });

  }

  startNextRound() {
    this.charadesService.emitEvents.nextRound();
  }

  failure(message: string) {
    this.snackBar.open(message, 'Dismiss', { duration: 2000 });
  }

}

import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

import { CharadesService } from 'src/app/services/charades/charades.service';
import { team } from 'src/app/services/charades/objects/team';
import { user } from 'src/app/services/charades/objects/user';
import { sessionEvents } from 'src/app/services/charades/events/sessionEvents';

@Component({
  selector: 'app-team-selection',
  templateUrl: './team-selection.component.html',
  styleUrls: ['./team-selection.component.scss']
})
export class TeamSelectionComponent implements OnInit {

  teamOne: user[];
  teamTwo: user[];
  ownerId: string;
  userId: string;

  constructor(private router: Router, private charadesService: CharadesService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.populateTeams();

    const subscription = this.charadesService.sessionSubject.subscribe(session => {
      switch(session) {
        case sessionEvents.update:
          this.populateTeams();
          break;

        case sessionEvents.error:
          this.failure('Can not start until there are at least 2 players in each team.');
          break;

        case sessionEvents.continue:
          subscription.unsubscribe();
          this.router.navigate(['/', `${this.charadesService.session.sessionId}`, `${this.charadesService.session.user.username}`, 'wordSelection'], { skipLocationChange: true});
          break;
      }
    });
  }

  populateTeams() {
    const users: user[] = Array.from(this.charadesService.session.users.values());
    this.teamOne = users.filter(user => user.team === team.one);
    this.teamTwo = users.filter(user => user.team === team.two);
    
    this.ownerId = this.charadesService.session.ownerId;
    this.userId = this.charadesService.session.user.userId;
  }

  joinTeam(changeTo: number) {
    if(this.charadesService.session.user.team != changeTo) {
      this.charadesService.emitEvents.changeTeam();
    }
  }

  shareLink() {
    const url: string = window.location.href;
    const navigator: any = window.navigator;
    const shareLink: any = {
      title: 'Charades Link',
      url: url.slice(0, url.lastIndexOf('/')),
    };

    if(navigator && navigator.canShare(shareLink)) {
      navigator.share(shareLink)
        .catch((err) => this.failure('Error Sharing'));
    } else {
      this.failure('Your device does not support sharing.')
    }
  }

  copyLink() {
    const url: string = window.location.href;

    navigator.clipboard.writeText(url.slice(0, url.lastIndexOf('/')));
    this.failure('Link Copied to Clipboard')
  }

  startGame() {
    this.charadesService.emitEvents.startGame();
  }

  
  failure(message: string) {
    this.snackBar.open(message, 'Dismiss', { duration: 2000 });
  }

}

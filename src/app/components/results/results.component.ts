import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CharadesService } from 'src/app/services/charades/charades.service';
import { sessionEvents } from 'src/app/services/charades/events/sessionEvents';
import { word } from 'src/app/services/charades/objects/word';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  teamOneWords: word[];
  teamTwoWords: word[];

  winner: string;

  constructor(private charadesService: CharadesService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if(this.charadesService.session.teamOneWords.length === 0) {
      this.charadesService.emitEvents.results();

      let timeout = setTimeout(() => {
        this.failure('Error Retrieving Results');
      }, 2000);

      const subscription = this.charadesService.sessionSubject.subscribe(sessionEvent => {
        subscription.unsubscribe();
  
        switch(sessionEvent) {
          case sessionEvents.results:
            clearTimeout(timeout);
            this.setup();
            break;
        }
      })
    } else {
      this.setup();
    }
    

  }

  setup() {
    this.teamOneWords = this.charadesService.session.teamOneWords;
    this.teamTwoWords = this.charadesService.session.teamTwoWords;

    let teamOneTime: number = 0;
    this.teamOneWords.forEach(teamWord => {
      teamOneTime += teamWord.time;
    });

    let teamTwoTime: number = 0;
    this.teamTwoWords.forEach(teamWord => {
      teamTwoTime += teamWord.time;
    });

    const diff = teamOneTime - teamTwoTime;

    if(diff > 0)
      this.winner = 'Team One Wins!';
      
    if(diff < 0)
      this.winner = 'Team Two Wins!';
      
    if(diff === 0)
      this.winner = 'It Is A Tie!';
  }

  
  failure(message: string) {
    this.snackBar.open(message, 'Dismiss', { duration: 2000 });
  }

  getTimeString(time: number) {
    const minutes: string = Math.floor(time/60).toString();
    const seconds: string = Math.floor(time%60).toString();
    return `${minutes.length >= 2 ? minutes : `0${minutes}`}m ${seconds.length >= 2 ? seconds : `0${seconds}`}s`;
  }

}

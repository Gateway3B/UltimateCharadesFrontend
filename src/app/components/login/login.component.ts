import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CharadesService } from 'src/app/services/charades/charades.service';
import { sessionEvents } from 'src/app/services/charades/events/sessionEvents';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  codeForm: FormControl;

  createIsDisabled: boolean;
  joinIsDisabled: boolean;

  constructor(private router: Router, private charadesService: CharadesService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.codeForm = new FormControl('', [Validators.required, Validators.minLength(4)]);

    this.createIsDisabled = false;
    this.joinIsDisabled = false;
  }

  getErrorMessage() {
    if(this.codeForm.hasError('required'))
      return 'Session Code Is Required';
    if(this.codeForm.hasError('minlength'))
      return 'Session Code Must Be 4 Characters';
  }

  create() {
    this.charadesService.emitEvents.createSession();
    
    this.createIsDisabled = true;
    this.joinIsDisabled = true;

    let timeout = setTimeout(() => {this.failure('Error Performing This Operation. Please Try Again.')}, 2000);

    const subscription = this.charadesService.sessionSubject.subscribe(session => {
      clearTimeout(timeout);
      subscription.unsubscribe();
      this.router.navigate(['/', `${this.charadesService.session.sessionId}`]);
    });

  }

  join(sessionCode: string) {
    this.codeForm.markAsTouched();
    if(!this.codeForm.invalid) {
      this.charadesService.emitEvents.joinSession(sessionCode);
    
      this.createIsDisabled = true;
      this.joinIsDisabled = true;

      let timeout = setTimeout(() => {this.failure('Error Performing This Operation. Please Try Again.')}, 2000);

      const subscription = this.charadesService.sessionSubject.subscribe(session => {
        clearTimeout(timeout);
        subscription.unsubscribe();

        switch(session) {
          case sessionEvents.continue:
            this.router.navigate(['/', `${this.charadesService.session.sessionId}`]);
            break;

          case sessionEvents.error:
            this.failure('Session Does Not Exist');
            break;
        }
      });

    }
  }

  failure(message: string) {
    this.snackBar.open(message, 'Dismiss', { duration: 2000 });
    this.createIsDisabled = false;
    this.joinIsDisabled = false;
  }
}

import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CharadesService } from '../services/charades/charades.service';
import { sessionEvents } from '../services/charades/events/sessionEvents';
import { state } from '../services/charades/objects/state';

@Injectable({
  providedIn: 'root'
})
export class UsernameGuard implements CanActivate {

  constructor(private charadesService: CharadesService, private router: Router, private location: Location) { }

  canActivate(next: ActivatedRouteSnapshot, stateRouter: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const sessionId: string = stateRouter.root.children[0].params.sessionId;
    const username: string = stateRouter.root.children[0].params.username;

    if(stateRouter.url === `/${sessionId}` || this.charadesService.session.users.size > 0) {
      return true;
    }

    if(sessionId.length !== 4 || /[^A-Z]/.test(sessionId)) {
      return this.router.parseUrl('/login');
    }
    
    this.charadesService.emitEvents.claimUser(sessionId, username);
    
    return new Observable<boolean | UrlTree>(subscribe => {
      let timeout = setTimeout(() => {
        subscribe.next(this.router.parseUrl( `/login`));
        subscribe.complete();
      }, 2000);
      
      this.charadesService.sessionSubject.subscribe(session => {
        clearTimeout(timeout);

        if(session === sessionEvents.userClaimed) {
          const baseRoute: string = `${this.charadesService.session.sessionId}/${this.charadesService.session.user.username}`;
          switch(this.charadesService.session.state) {
            case(state.teamSelection):
              subscribe.next(this.router.parseUrl(baseRoute));
              break;

            case(state.wordSelection):
              subscribe.next(false);
              this.location.replaceState(baseRoute);
              this.router.navigateByUrl(this.router.parseUrl(baseRoute + '/wordSelection'), {skipLocationChange: true});
              break;

            case(state.teamOnePlay):
            case(state.teamTwoPlay):
              subscribe.next(false);
              this.location.replaceState(baseRoute);
              this.router.navigateByUrl(this.router.parseUrl(baseRoute + '/charades'), {skipLocationChange: true});
              break;

            case(state.results):
              subscribe.next(false);
              this.location.replaceState(baseRoute);
              this.router.navigateByUrl(this.router.parseUrl(baseRoute + '/results'), {skipLocationChange: true});
              break;

          }
          subscribe.complete();
        }
      });
    });
  }
  
}

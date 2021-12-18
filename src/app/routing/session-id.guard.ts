import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CharadesService } from '../services/charades/charades.service';
import { sessionEvents } from '../services/charades/events/sessionEvents';

@Injectable({
  providedIn: 'root'
})
export class SessionIdGuard implements CanActivate {

  constructor(private charadesService: CharadesService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const sessionId: string = state.root.children[0].params.sessionId;

    if(this.router.url === '/login') {
      return true;
    }

    if(sessionId.length !== 4 || /[^A-Z]/.test(sessionId)) {
      return this.router.parseUrl('/login');
    }
    
    
    this.charadesService.emitEvents.joinSession(sessionId);
    
    return new Observable<boolean | UrlTree>(subscribe => {
      let timeout = setTimeout(() => {
        subscribe.next(this.router.parseUrl('/login'));
        subscribe.complete();
      }, 2000);
      
      this.charadesService.sessionSubject.subscribe(session => {
        clearTimeout(timeout);

        switch(session) {
          case sessionEvents.error:
            subscribe.next(this.router.parseUrl('/login'));
            break;

          case sessionEvents.continue:
            subscribe.next(true);
            break;
        }

        subscribe.complete();
      });
    });

  }
}

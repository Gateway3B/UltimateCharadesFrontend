import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CharadesComponent } from '../components/charades/charades.component';

import { LoginComponent } from '../components/login/login.component';
import { ResultsComponent } from '../components/results/results.component';
import { TeamSelectionComponent } from '../components/team-selection/team-selection.component';
import { UsernameComponent } from '../components/username/username.component';
import { WordSelectionComponent } from '../components/word-selection/word-selection.component';
import { SessionIdGuard } from './session-id.guard';
import { UsernameGuard } from './username.guard';

const routes: Routes = [
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: ':sessionId/:username/results', component: ResultsComponent, data: { animation: 'Results'}, canActivate: [UsernameGuard] },
  { path: ':sessionId/:username/charades', component: CharadesComponent, data: { animation: 'Charades'}, canActivate: [UsernameGuard] },
  { path: ':sessionId/:username/wordSelection', component: WordSelectionComponent, data: { animation: 'WordSelection'}, canActivate: [UsernameGuard] },
  { path: ':sessionId/:username', component: TeamSelectionComponent, data: { animation: 'TeamSelection'}, canActivate: [UsernameGuard] },
  { path: ':sessionId', component: UsernameComponent, data: { animation: 'Username'}, canActivate: [SessionIdGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

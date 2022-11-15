import { Subject } from "rxjs";
import { session } from "../objects/session";
import { state } from "../objects/state";
import { user } from "../objects/user";
import { sessionEvents } from "./sessionEvents";

export class receiveEvents {

    constructor(private session: session, private sessionSubject: Subject<sessionEvents>) {}

    sessionJoined(sessionId: string) {
        this.session.reAssign(session.CreateEmpty());
        this.session.sessionId = sessionId;
        this.sessionSubject.next(sessionEvents.continue);
    }

    sessionDoesNotExist(message: string) {
        this.sessionSubject.next(sessionEvents.error);
    }

    usernameAccepted(userId: string) {
        this.session.userId = userId;
        this.sessionSubject.next(sessionEvents.continue);
    }

    usernameTaken(message: any) {
        this.sessionSubject.next(sessionEvents.error);
    }

    userAdded(userString: string) {
        const user: user = JSON.parse(userString);
        this.session.users.forEach(iUser => {
            if(iUser.username === user.username)
                this.session.users.delete(iUser.userId);
        })
        this.session.users.set(user.userId, user);
        this.sessionSubject.next(sessionEvents.update);
    }

    existingUsers(existingUsersString: string) {
        const existingUsers: user[] = JSON.parse(existingUsersString);
        const usersMap: Map<string, user> = new Map(existingUsers.map(user => [user.userId, user]));

        this.session.users = usersMap;
    }

    setOwner(ownerId: string) {
        this.session.ownerId = ownerId;
    }

    cantBegin(message: string) {
        this.sessionSubject.next(sessionEvents.error);
    }

    teamsSet(message: string) {
        this.sessionSubject.next(sessionEvents.continue);
    }

    wordAdded(word: string) {
        this.session.words.push(word);
        this.sessionSubject.next(sessionEvents.update);
    }

    wordDeleted(word: string) {
        const index: number = this.session.words.indexOf(word);
        this.session.words = this.session.words.filter(value => {
            return value !== word;
        });
        this.sessionSubject.next(sessionEvents.update);
    }

    usToggle(message: string) {
        const index: number = this.session.user.team - 1;
        this.session.ready[index] = !this.session.ready[index];
        this.sessionSubject.next(sessionEvents.usToggle);

    }

    themToggle(message: string) {
        const index: number = this.session.user.team === 1?1:0;
        this.session.ready[index] = !this.session.ready[index];
        this.sessionSubject.next(sessionEvents.themToggle);
    }

    nextRound(nextRoundString: string) {
        const { currentPlayerId, currentState } = JSON.parse(nextRoundString);

        this.session.currentPlayerId = currentPlayerId;
        this.session.state = currentState;

        this.sessionSubject.next(sessionEvents.continue);
    }

    charadesWord(charadesWord: string) {
        this.session.currentWord = charadesWord;
    }

    timerUpdate(time: number) {
        this.session.currentTime = time;
        this.sessionSubject.next(sessionEvents.update);
    }

    timerStart(message: string) {
        this.sessionSubject.next(sessionEvents.timerStart);
    }

    timerStop(message: string) {
        this.sessionSubject.next(sessionEvents.timerStop);
    }

    results(words: string) {
        const { teamOneWords, teamTwoWords } = JSON.parse(words);
        this.session.state = state.results;
        this.session.teamOneWords = teamOneWords;
        this.session.teamTwoWords = teamTwoWords;
        this.sessionSubject.next(sessionEvents.results);
    }

    userClaimed(sessionString: string) {
        const sessionPrototype = JSON.parse(sessionString);
        sessionPrototype.users = new Map(sessionPrototype.users.map(user => [user.userId, user]));
        this.session.reAssign(sessionPrototype);
        this.sessionSubject.next(sessionEvents.userClaimed);
    }

}
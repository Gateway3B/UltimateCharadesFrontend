import { Subject } from "rxjs";
import { session } from "../objects/session";
import { state } from "../objects/state";
import { user } from "../objects/user";
import { sessionEvents } from "./sessionEvents";

export class receiveEvents {
    static session: session;
    static sessionSubject: Subject<sessionEvents>

    constructor(session: session, sessionSubject: Subject<sessionEvents>) {
        receiveEvents.session = session;
        receiveEvents.sessionSubject = sessionSubject;
    }

    events = {
        sessionJoined: receiveEvents.onSessionJoined,
        sessionDoesNotExist: receiveEvents.sessionDoesNotExist,
        usernameAccepted: receiveEvents.usernameAccepted,
        usernameTaken: receiveEvents.usernameTaken,
        userAdded: receiveEvents.userAdded,
        existingUsers: receiveEvents.existingUsers,
        setOwner: receiveEvents.setOwner,
        userClaimed: receiveEvents.userClaimed,
        cantBegin: receiveEvents.cantBegin,
        teamsSet: receiveEvents.teamsSet,
        wordAdded: receiveEvents.wordAdded,
        wordDeleted: receiveEvents.wordDeleted,
        usToggle: receiveEvents.usToggle,
        themToggle: receiveEvents.themToggle,
        nextRound: receiveEvents.nextRound,
        charadesWord: receiveEvents.charadesWord,
        timerUpdate: receiveEvents.timerUpdate,
        timerStart: receiveEvents.timerStart,
        timerStop: receiveEvents.timerStop,
        results: receiveEvents.results
    }

    static onSessionJoined(sessionId: string) {
        receiveEvents.session.reAssign(session.CreateEmpty());
        receiveEvents.session.sessionId = sessionId;
        receiveEvents.sessionSubject.next(sessionEvents.continue);
    }

    static sessionDoesNotExist(message: string) {
        receiveEvents.sessionSubject.next(sessionEvents.error);
    }

    static usernameAccepted(username: string) {
        receiveEvents.sessionSubject.next(sessionEvents.continue);
    }

    static usernameTaken(message: any) {
        receiveEvents.sessionSubject.next(sessionEvents.error);
    }

    static userAdded(userString: string) {
        const user: user = JSON.parse(userString);
        receiveEvents.session.users.set(user.userId, user);
        receiveEvents.sessionSubject.next(sessionEvents.update);
    }

    static existingUsers(existingUsersString: string) {
        const existingUsers: user[] = JSON.parse(existingUsersString);
        const usersMap: Map<string, user> = new Map(existingUsers.map(user => [user.userId, user]));

        receiveEvents.session.users = usersMap;
    }

    static setOwner(ownerId: string) {
        receiveEvents.session.ownerId = ownerId;
    }

    static cantBegin(message: string) {
        receiveEvents.sessionSubject.next(sessionEvents.error);
    }

    static teamsSet(message: string) {
        receiveEvents.sessionSubject.next(sessionEvents.continue);
    }

    static wordAdded(word: string) {
        receiveEvents.session.words.push(word);
        receiveEvents.sessionSubject.next(sessionEvents.update);
    }

    static wordDeleted(word: string) {
        const index: number = receiveEvents.session.words.indexOf(word);
        receiveEvents.session.words = receiveEvents.session.words.filter(value => {
            return value !== word;
        });
        receiveEvents.sessionSubject.next(sessionEvents.update);
    }

    static usToggle(message: string) {
        const index: number = receiveEvents.session.user.team - 1;
        receiveEvents.session.ready[index] = !receiveEvents.session.ready[index];
        receiveEvents.sessionSubject.next(sessionEvents.usToggle);

    }

    static themToggle(message: string) {
        const index: number = receiveEvents.session.user.team === 1?1:0;
        receiveEvents.session.ready[index] = !receiveEvents.session.ready[index];
        receiveEvents.sessionSubject.next(sessionEvents.themToggle);
    }

    static nextRound(nextRoundString: string) {
        const { currentPlayerId, currentState } = JSON.parse(nextRoundString);

        receiveEvents.session.currentPlayerId = currentPlayerId;
        receiveEvents.session.state = currentState;

        receiveEvents.sessionSubject.next(sessionEvents.continue);
    }

    static charadesWord(charadesWord: string) {
        receiveEvents.session.currentWord = charadesWord;
    }

    static timerUpdate(time: number) {
        receiveEvents.session.currentTime = time;
        receiveEvents.sessionSubject.next(sessionEvents.update);
    }

    static timerStart(message: string) {
        receiveEvents.sessionSubject.next(sessionEvents.timerStart);
    }

    static timerStop(message: string) {
        receiveEvents.sessionSubject.next(sessionEvents.timerStop);
    }

    static results(words: string) {
        const { teamOneWords, teamTwoWords } = JSON.parse(words);
        receiveEvents.session.state = state.results;
        receiveEvents.session.teamOneWords = teamOneWords;
        receiveEvents.session.teamTwoWords = teamTwoWords;
        receiveEvents.sessionSubject.next(sessionEvents.results);
    }

    static userClaimed(sessionString: string) {
        const sessionPrototype = JSON.parse(sessionString);
        sessionPrototype.users = new Map(sessionPrototype.users.map(user => [user.userId, user]));
        receiveEvents.session.reAssign(sessionPrototype);
        receiveEvents.sessionSubject.next(sessionEvents.userClaimed);
    }

}
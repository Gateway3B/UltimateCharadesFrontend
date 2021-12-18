import { state } from "./state";
import { user } from "./user";

export class session {
    sessionId: string;
    userId: string;
    ownerId: string;
    users: Map<string, user>;
    words: string[];
    ready: boolean[]
    state: state;
    currentWord: string;
    currentPlayerId: string;
    currentTime: number

    static CreateEmpty(): session {
        return new session('', '', '', new Map(), [], [false, false], state.teamSelection, '', '', 0);
    };

    constructor(sessionId: string, userId: string, ownerId: string, users: Map<string, user>, words: string[], ready: boolean[], state: state, currentPlayerId: string, currentWord: string, currentTime: number) {
        this.sessionId = sessionId;
        this.userId = userId;
        this.ownerId = ownerId;
        this.users = users;
        this.words = words;
        this.ready = ready;
        this.state = state;
        this.currentPlayerId = currentPlayerId;
        this.currentWord = currentWord;
        this.currentTime = currentTime;
    }

    reAssign(session: session) {
        this.sessionId = session.sessionId;
        this.userId = session.userId;
        this.ownerId = session.ownerId;
        this.users = session.users;
        this.words = session.words;
        this.ready = session.ready;
        this.state = session.state;
        this.currentPlayerId = session.currentPlayerId;
        this.currentWord = session.currentWord;
    }

    get user() {
        return this.users.get(this.userId);
    }
}
import { SocketService } from "../../socket/socket.service";
import { session } from "../objects/session";

export class emitEvents {

    constructor(private session: session, private socketService: SocketService) {}

    createSession() {
        this.socketService.emitToServer('createSession', null);
    }

    joinSession(sessionId: string) {
        this.socketService.emitToServer('joinSession', sessionId);
    }

    setUsername(username: string) {
        this.socketService.emitToServer('setUsername', username);
    }

    changeTeam() {
        this.socketService.emitToServer('changeTeam', null);
    }

    claimUser(sessionId: string, username: string) {
        this.socketService.emitToServer('claimUser', JSON.stringify({sessionId: sessionId, username: username}));
    }

    startGame() {
        this.socketService.emitToServer('startGame', null);
    }

    addWord(word: string) {
        this.socketService.emitToServer('addWord', word);
    }

    deleteWord(word: string) {
        this.socketService.emitToServer('deleteWord', word);
    }

    usToggle() {
        this.socketService.emitToServer('usToggle', null);
    }

    startTimer() {
        this.socketService.emitToServer('startTimer', null);
    }

    stopTimer() {
        this.socketService.emitToServer('stopTimer', null);
    }

    nextRound() {
        this.socketService.emitToServer('nextRound', null);
    }

    results() {
        this.socketService.emitToServer('results', null);
    }
}
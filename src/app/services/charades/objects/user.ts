import { team } from "./team";

export class user {
    userId: string;
    username: string;
    team: team;
    roundCount: number;

    constructor(userId: string) {
        this.userId = userId;
        this.username = '';
        this.team = team.one;
        this.roundCount = 0;
    }
}
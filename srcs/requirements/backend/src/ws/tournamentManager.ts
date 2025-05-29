import WebSocket from 'ws';
import { gameType, leanGameSettings } from './remoteGameApp/settings';
import { Tournament, tournamentState } from './tournament';

export class TournamentManager {
  private tournaments: Map<gameType, Tournament[]> = new Map();
  private playerSockets: Map<string, WebSocket> = new Map();
  private socketToPlayerId: Map<WebSocket, string> = new Map();
  private playerTournaments: Map<string, Tournament> = new Map();

  constructor() {
    this.tournaments.set('Classic Pong', []);
    this.tournaments.set('Crazy Pong', []);
  }

  private getTournaments(type: gameType): Tournament[] {
    return this.tournaments.get(type)!;
  }

  public getPlayerTournamentBySocket(ws: WebSocket): Tournament | undefined {
    const playerId = this.socketToPlayerId.get(ws);
    if (!playerId) return;
    return this.playerTournaments.get(playerId);
  }

  public isPlayerInATournament(playerId: string): boolean {
    return this.playerTournaments.get(playerId) !== undefined;
  }

  public async attributePlayerToTournament(ws: WebSocket, settings: leanGameSettings) {
    await this.clearEndedTournaments(this.getTournaments(settings.gameType));
    const { playerID } = settings;
    this.playerSockets.set(playerID, ws);
    this.socketToPlayerId.set(ws, playerID);
    if (!(await this.foundTournament(ws, settings))) {
      await this.createTournament(ws, settings);
    }
    // TODO: Pass start logic to Tournament
    const playerTournament = this.getPlayerTournamentBySocket(ws);
    if (playerTournament && playerTournament.isFull()) await playerTournament.start();
  }

  private async foundTournament(ws: WebSocket, settings: leanGameSettings) {
    const openTournament = this.getTournaments(settings.gameType).find(
      (t) => t.state === tournamentState.creating,
    );
    if (openTournament) {
      await openTournament.attributePlayerToSession(ws, settings);
      if (openTournament.isFull()) openTournament.state = tournamentState.full;
      this.playerTournaments.set(settings.playerID, openTournament);
      console.log(
        `Player joined ${settings.gameType} Tournament: `,
        JSON.stringify(openTournament.print()),
      );
      return true;
    }
    return false;
  }

  private async createTournament(ws: WebSocket, settings: leanGameSettings) {
    const newTournament = new Tournament(settings.gameType);
    // try {
    //   const BCtournaments = await contractProvider.getAllTournaments(
    //     gameTypeToEnum(settings.gameType),
    //   );
    //   newTournament.id = BCtournaments.length;
    // } catch (err) {
    //   console.log(`Error in getAllTournaments Blockchain call: ${err}`);
    // }
    await newTournament.createSession(ws, settings);
    this.getTournaments(settings.gameType).push(newTournament);
    this.playerTournaments.set(settings.playerID, newTournament);
    console.log(
      `New ${settings.gameType} Tournament created: `,
      JSON.stringify(newTournament.print()),
    );
  }

  public async removePlayerTournament(ws: WebSocket) {
    const playerId = this.socketToPlayerId.get(ws);
    if (!playerId) return;
    const tournament = this.playerTournaments.get(playerId);
    if (!tournament) return;
    await tournament.removePlayer(ws);
    this.cleanupPlayer(playerId, ws);
  }

  private cleanupPlayer(playerId: string, ws: WebSocket) {
    this.playerTournaments.delete(playerId);
    this.playerSockets.delete(playerId);
    this.socketToPlayerId.delete(ws);
  }

  private async clearEndedTournaments(tournaments: Tournament[]) {
    const endedTournaments = tournaments.filter((t) => t.state === tournamentState.ended);
    await Promise.all(endedTournaments.map((t) => this.removeTournament(t)));
  }

  private removeTournament(tournament: Tournament) {
    const tournaments = this.getTournaments(tournament.type);
    const index = tournaments.indexOf(tournament);
    if (index !== -1) tournaments.splice(index, 1);
  }

  printTournaments(tournaments: Tournament[]) {
    console.log(`Existing tournaments:`);
    tournaments.forEach((t) => console.log(t.print()));
  }
}

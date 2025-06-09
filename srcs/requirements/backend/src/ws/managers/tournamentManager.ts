import WebSocket from 'ws';
import { gameType, leanGameSettings } from './../remoteGameApp/settings';
import { Tournament, tournamentState } from './../tournament';
import { removeItem } from './../helpers';

export class TournamentManager {
  private tournaments: Map<gameType, Tournament[]> = new Map();
  private playerTournaments: Map<string, Tournament> = new Map();

  constructor() {
    this.tournaments.set('Classic Pong', []);
    this.tournaments.set('Crazy Pong', []);
  }

  private getTournaments(type: gameType): Tournament[] {
    return this.tournaments.get(type)!;
  }

  public getPlayerTournament(playerId: string) {
    return this.playerTournaments.get(playerId);
  }

  public isPlayerInATournament(playerId: string): boolean {
    return this.playerTournaments.get(playerId) !== undefined;
  }

  public async attributePlayerToTournament(ws: WebSocket, settings: leanGameSettings) {
    await this.clearEndedTournaments(this.getTournaments(settings.gameType));
    if (!(await this.foundTournament(ws, settings))) {
      await this.createTournament(ws, settings);
    }
  }

  private async foundTournament(ws: WebSocket, settings: leanGameSettings) {
    const openTournament = this.getTournaments(settings.gameType).find(
      (t) => t.state === tournamentState.creating,
    );
    if (openTournament) {
      if (openTournament.hasAlias(settings.alias)) settings.alias = settings.alias.concat('1');
      await openTournament.setPlayer(ws, settings);
      this.playerTournaments.set(settings.playerID, openTournament);
      console.log(
        `Player joined ${settings.gameType} Tournament: `,
        JSON.stringify(openTournament.print()),
      );
      if (openTournament.isFull()) await openTournament.start();
      return true;
    }
    return false;
  }

  private async createTournament(ws: WebSocket, settings: leanGameSettings) {
    const newTournament = new Tournament(settings.gameType);
    await newTournament.setPlayer(ws, settings);
    this.getTournaments(settings.gameType).push(newTournament);
    this.playerTournaments.set(settings.playerID, newTournament);
    console.log(
      `New ${settings.gameType} Tournament created: `,
      JSON.stringify(newTournament.print()),
    );
  }

  public async removePlayerTournamentManager(playerId: string) {
    const tournament = this.playerTournaments.get(playerId);
    if (!tournament) return;
    await tournament.removePlayerTournament(playerId);
    this.playerTournaments.delete(playerId);
  }

  private async clearEndedTournaments(tournaments: Tournament[]) {
    const endedTournaments = tournaments.filter((t) => t.state === tournamentState.ended);
    await Promise.all(endedTournaments.map((t) => this.removeTournament(t)));
  }

  private removeTournament(tournament: Tournament) {
    const tournaments = this.getTournaments(tournament.type);
    removeItem(tournaments, tournament);
  }

  printTournaments(tournaments: Tournament[]) {
    console.log(`Existing tournaments:`);
    tournaments.forEach((t) => console.log(t.print()));
  }
}

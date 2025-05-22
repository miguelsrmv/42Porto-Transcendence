import WebSocket from 'ws';
import { leanGameSettings } from './remoteGameApp/settings';
import { Tournament, tournamentState } from './tournament';

const classicTournaments: Tournament[] = [];
const crazyTournaments: Tournament[] = [];
const playerTournamentMap = new Map<WebSocket, Tournament>();

function gameTypeToTournaments(type: string) {
  if (type === 'Classic Pong') return classicTournaments;
  else return crazyTournaments;
}

async function createTournament(ws: WebSocket, playerSettings: leanGameSettings) {
  const newTournament = new Tournament(playerSettings.gameType);
  await newTournament.createSession(ws, playerSettings);
  gameTypeToTournaments(playerSettings.gameType).push(newTournament);
  playerTournamentMap.set(ws, newTournament);
  console.log(`New ${playerSettings.gameType} Tournament created: `, JSON.stringify(newTournament));
}

function getOpenTournament(tournaments: Tournament[]) {
  return tournaments.find((tournament) => tournament.state === tournamentState.creating);
}

async function foundTournament(ws: WebSocket, playerSettings: leanGameSettings) {
  const tournament = getOpenTournament(gameTypeToTournaments(playerSettings.gameType));
  if (tournament) {
    await tournament.attributePlayerToSession(ws, playerSettings);
    if (tournament.isFull()) tournament.state = tournamentState.full;
    console.log(
      `Player joined ${playerSettings.gameType} Tournament: `,
      JSON.stringify(tournament),
    );
    return true;
  }
  return false;
}

export async function attributePlayerToTournament(ws: WebSocket, playerSettings: leanGameSettings) {
  if (!(await foundTournament(ws, playerSettings))) {
    await createTournament(ws, playerSettings);
  }
}

export function removePlayerTournament(playerSocket: WebSocket) {
  const tournament = playerTournamentMap.get(playerSocket);
  if (!tournament) return;
  tournament.removePlayer(playerSocket);
  playerTournamentMap.delete(playerSocket);
}

export function getPlayerTournament(socket: WebSocket) {
  return playerTournamentMap.get(socket);
}

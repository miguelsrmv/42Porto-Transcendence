import WebSocket from 'ws';

// NOTE: Unused for now
export class PlayerManager {
  private playerToSocket: Map<string, WebSocket> = new Map();
  private socketToPlayer: Map<WebSocket, string> = new Map();

  register(playerId: string, socket: WebSocket) {
    this.playerToSocket.set(playerId, socket);
    this.socketToPlayer.set(socket, playerId);
  }

  unregister(socket: WebSocket) {
    const playerId = this.socketToPlayer.get(socket);
    if (!playerId) return;

    this.playerToSocket.delete(playerId);
    this.socketToPlayer.delete(socket);
  }

  getSocket(playerId: string): WebSocket | undefined {
    return this.playerToSocket.get(playerId);
  }

  getPlayerId(socket: WebSocket): string | undefined {
    return this.socketToPlayer.get(socket);
  }

  isPlayerConnected(playerId: string): boolean {
    return this.playerToSocket.has(playerId);
  }
}

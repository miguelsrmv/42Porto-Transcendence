const TIMEOUT_VALUE = 30; // 30 seconds

class ReconnectionManager {
  private timeouts = new Map<string, NodeJS.Timeout>();

  markDisconnected(playerId: string, onTimeout: () => void) {
    console.log('Client connection is lagging...');
    if (this.timeouts.has(playerId)) return;

    const timeout = setTimeout(() => {
      this.timeouts.delete(playerId);
      onTimeout();
    }, TIMEOUT_VALUE * 1000);

    this.timeouts.set(playerId, timeout);
  }

  isInGracePeriod(playerId: string) {
    return this.timeouts.has(playerId);
  }

  clearTimeout(playerId: string) {
    const timeout = this.timeouts.get(playerId);
    if (timeout) clearTimeout(timeout);
    this.timeouts.delete(playerId);
  }
}

export const reconnectionManager = new ReconnectionManager();

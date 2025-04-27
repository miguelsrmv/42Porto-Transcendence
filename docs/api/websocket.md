## WebSocket Routes

**Note:** in maintenance

| Event     | Route           | Parameters | Payload Sent / Expected | Description                      |
| --------- | --------------- | ---------- | ----------------------- | -------------------------------- |
| `connect` | `/ws`           |            |                         | Initiates a WebSocket connection |
| `message` | `/ws`           |            |                         | Message sent by client           |
| `error`   | server → client |            |                         | Sent when client sends bad data  |
| `close`   | `/ws`           |            |                         | Connection is closed             |

## WebSocket message types

### ClientMessage

Messages **sent from the client to the server**.

**Types:**

- `join_game`
  - **Description:** Request to join a remote game and respective player settings.
  - **Payload:**
    - `playerSettings: leanGameSettings`
- `movement`
  - **Description:** Send a movement command to the server.
  - **Payload:**
    - `direction: 'up' | 'down' | 'stop'`
- `power_up`
  - **Description:** Notify the server that the player wants to use a power-up.
  - **Payload:**
    - _(none)_

### ServerMessage

Messages **sent from the server to the client**.

**Types:**

- `game_state`
  - **Description:** Update the client with the current game state.
  - **Payload:**
    - `state: GameSate`
- `game_start`
  - **Description:** Notify clients that the game has started.
  - **Payload:**
    - `players: [string, string]` — Tuple of player IDs.
    - `settings: gameSettings` — Full game settings
- `error`
  - **Description:** Inform the client that an error occurred.
  - **Payload:**
    - `message: string` — Error message.

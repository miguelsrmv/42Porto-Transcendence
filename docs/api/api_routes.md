# API Endpoints

| Method   | Route                     |   URL parameters   |                     Body                     | Description                                                     |
| -------- | ------------------------- | :----------------: | :------------------------------------------: | --------------------------------------------------------------- |
| `GET`    | `/`                       |                    |                                              | Base route for test                                             |
| `GET`    | `/users/me`               |                    |                                              | Get own user                                                    |
| `GET`    | `/users/:id`              |    `id` user id    |                                              | Get a specific user public data                                 |
| `POST`   | `/users`                  |                    | username, email, password and repeatPassword | Create a new user                                               |
| `PATCH`  | `/users`                  |                    |                data to update                | Update own user data                                            |
| `DELETE` | `/users`                  |                    |                   password                   | Delete own user                                                 |
| `POST`   | `/users/preLogin`         |                    |              email and password              | Check if user has 2FA enabled                                   |
| `POST`   | `/users/login`            |                    |              email and password              | Get JWT (if user is valid)                                      |
| `POST`   | `/users/login2FA`         |                    |          email, password and token           | Get JWT (if user and 2FA token are valid)                       |
| `DELETE` | `/users/logout`           |                    |                                              | Logout user                                                     |
| `GET`    | `/users/checkLoginStatus` |                    |                                              | Check if user is logged in                                      |
| `GET`    | `/users/:id/stats`        |    `id` user id    |                                              | Get match stats of that user                                    |
| `POST`   | `/users/2FA/verify`       |                    |             token (and password)             | Checks if user enters valid token for 2FA                       |
| `GET`    | `/users/2FA/check`        |                    |                                              | Checks if user has 2FA enabled                                  |
| `GET`    | `/users/2FA/setup`        |                    |                                              | Sets up 2FA for the user                                        |
| `GET`    | `/users/2FA/disable`      |                    |                                              | Disables 2FA for the user                                       |
| `GET`    | `/users/getAvatarPath`    |                    |                                              | Get user's avatar image path                                    |
| `PUT`    | `/users/defaultAvatar`    |                    |                     path                     | Updates avatar image path to a default                          |
| `PUT`    | `/users/customAvatar`     |                    |                 avatar data                  | Uploads custom avatar image                                     |
| `GET`    | `/leaderboard`            |                    |                                              | Get leaderboard                                                 |
| `GET`    | `/friends`                |                    |                                              | Get all friends of logged in user                               |
| `GET`    | `/friends/pending`        |                    |                                              | Get pending friends of logged in user                           |
| `POST`   | `/friends`                |                    |                   friendId                   | Create a friendship between the logged in user and another user |
| `POST`   | `/friends/username`       |                    |                   username                   | Create a friendship between the logged in user and another user |
| `PATCH`  | `/friends/accept`         |                    |                   friendId                   | Change friendship status between users to accepted              |
| `DELETE` | `/friends/:id`            |   `id` friend id   |                                              | Delete a friendship                                             |
| `GET`    | `/matches/user/:id`       |    `id` user id    |                                              | Get all matches from a specific user                            |
| `GET`    | `/matches/:id`            |   `id` match id    |                                              | Get a specific match                                            |
| `GET`    | `/tournaments/:id`        | `id` tournament id |                                              | Get data on a specific tournament                               |
| `GET`    | `/tournaments/user/:id`   |    `id` user id    |                                              | Get user's latest 3 tournaments                                 |

## Base

When making requests to the API through the Docker container, the base API endpoint is
`http://backend:3000/api` 'backend' being the name of the container running the API and '3000' being the chosen port for communication with it.  
If running the app locally (e.g. `npx tsx server.ts`), the endpoint is `http://localhost:3000/`

## Users

- **Get a specific user (Protected):** `GET /users/:id`

### Response example

```json
{
  "username": "john_doe",
  "lastActiveAt": "2025-06-04T09:57:41.096Z",
  "avatarUrl": "../static/avatar.png",
  "rank": 8,
  "points": 30,
  "onlineState": "offline"
}
```

- **Get own user (Protected):** `GET /users/me`

### Response example

```json
{
  "email": "john_doe@example.com",
  "username": "john_doe",
  "id": "92c4f55f-5000-440e-ae20-20d2fa7c2dbe",
  "avatarUrl": "../static/avatar.png"
}
```

- **Create a new user:** `POST /users`

### Request body example

```json
{
  "username": "new_user_name",
  "email": "new_user@email.com",
  "password": "password",
  "repeatPassword": "password"
}
```

### Response example

```json
{
  "email": "new_user@email.com",
  "username": "new_user_name"
}
```

- **Update own user (Protected):** `PATCH /users`

### Request body example

```json
{
  "username": "new_user_name", // optional
  "email": "new_user@email.com", // optional
  "oldPassword": "newPassword",
  "newPassword": "newPassword", // optional
  "repeatPassword": "newPassword" // optional
}
```

### Response example

```json
{
  "email": "updated_user@email.com",
  "username": "updated_username"
}
```

- **Delete own user (Protected):** `DELETE /users`

### Request body example

```json
{
  "password": "password"
}
```

### Response example

```json
{
  "message": "User deleted successfully"
}
```

- **Check if user has 2FA enabled:** `POST /users/preLogin`

### Request body example

```json
{
  "email": "user@email.com",
  "password": "password"
}
```

### Response example

```json
{
  "enabled2FA": true
}
```

- **User login with 2FA (Get JWT):** `POST /users/login2FA`

### Request body example

```json
{
  "email": "user@email.com",
  "password": "password",
  "code": "325362"
}
```

### Response example

```json
{
  "avatar": "../static/avatar.png"
}
```

**Note:** The token will be saved in a Cookie `access_token`. Requests to protected routes require this cookie to be set with a valid token.

- **User login (Get JWT) :** `POST /users/login`

### Request body example

```json
{
  "email": "user@email.com",
  "password": "password"
}
```

### Response example

```json
{
  "avatar": "../static/avatar.png"
}
```

**Note:** The token will be saved in a Cookie `access_token`. Requests to protected routes require this cookie to be set with a valid token.

- **Check if user is logged in (Protected):** `GET /users/checkLoginStatus`

### Response example

```c
{
  "User is logged in"
}
```

- **Logout a user (Protected):** `DELETE /users/logout`

### Response example

```json
{
  "message": "Logout successful!"
}
```

- **Get a user's stats (Protected):** `GET /users/:id/stats`

### Response example

```json
{
  "stats": {
    "totalMatches": 24,
    "wins": 12,
    "losses": 12,
    "winRate": 0.5,
    "points": 23,
    "rank": 5,
    "tournaments": 2
  }
}
```

- **Checks if user enters valid token for 2FA (Protected):** `POST /users/2FA/verify`

### Request body example

```json
{
  "code": "2FAtoken",
  "password": "password"
}
```

### Response example

```json
{
  "token": "token"
}
```

**Note:** The token will be saved in a Cookie `access_token`. Requests to protected routes require this cookie to be set with a valid token.

- **Checks if user has 2FA enabled (Protected):** `GET /users/2FA/check`

### Response example

```json
{
  "enabled2FA": true
}
```

- **Sets up 2FA for that user (Protected):** `GET /users/2FA/setup`

### Response example

```c
{
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAAA... (truncated)"
}
```

- **Updates avatar image path to a default (Protected):** `PUT /users/defaultAvatar`

### Request body example

```json
{
  "path": "default/avatar.png"
}
```

### Response example

```json
{
  "message": "Path to avatar updated successfully."
}
```

- **Uploads custom avatar image (Protected):** `PUT /users/customAvatar`

### Request body example

```json
{
  "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAAA... (truncated)"
}
```

### Response example

```json
{
  "message": "Avatar uploaded."
}
```

- **Get user's avatar image path (Protected):** `GET /users/getAvatarPath`

### Response example

```json
{
  "path": "avatar/avatar.png"
}
```

## Friendships

- **Get all friendships for logged in user (Protected):** `GET /friends`

### Response example

```c
{
 ["92c4f55f-5000-440e-ae20-20d2fa7c2dbe", "76c4f55f-5020-330e-ae20-20d1237c2dbi", ...]
}
```

- **Get pending friends of logged in user (Protected):** `GET /friends/pending`

### Response example

```json
{
 [
  {"initiatorId": "92c4f55f-5000-440e-ae20-20d2fa7c2dbe"}
  ]
}
```

- **Create a new friendship (Protected):** `POST /friends`

### Request body example

```json
{
  "friendId": "<id>"
}
```

### Response example

```json
{
  "message": "Friendship created"
}
```

- **Create a new friendship, based on friend username (Protected):** `POST /friends/username`

### Request body example

```json
{
  "username": "<username>"
}
```

### Response example

```json
{
  "message": "Friendship created"
}
```

- **Delete a friendship (Protected):** `DELETE /friends/:id`

### Response example

```json
{
  "message": "Friendship deleted"
}
```

- **Accept a friendship (Protected):** `PATCH friends/accept`

### Request body example

```json
{
  "friendId": "d232f55f-5000-440e-ae20-20d2fa7c2dbe"
}
```

### Response example

```json
{
  "message": "Friendship accepted"
}
```

## Leaderboard

- **Get leaderboard (Protected):** `GET /leaderboard`

### Response example

```json
{
  [
    {
      "userId": "d232f55f-5000-440e-ae20-20d2fa7c2dbe",
      "score": 24
    },
  ]
}
```

## Matches

- **Get all matches from a specific user:** `GET /matches/user/:id`

### Response example

```json
[
  {
    "id": "v532f55f-5000-440e-ae20-20d2fa732see",
    "mode": "CRAZY", // CLASSIC
    "user1Id": "v532dt5f-5000-440e-ae20-20d2fa732see",
    "user2Id": "b3d2f55f-5000-440e-ae20-20d2fa732see",
    "user1Score": 3,
    "user2Score": 5,
    "user1Character": "PIKACHU",
    "user2Character": "MARIO",
    "user1Alias": "chris",
    "user2Alias": "anna",
    "winnerId": "b3d2f55f-5000-440e-ae20-20d2fa732see",
    "createdAt": "2025-06-04T09:57:41.096Z",
    "stats": "{\"left\":{\"goals\":0,\"sufferedGoals\":5,\"saves\":0,\"powersUsed\":0},\"right\":{\"goals\":5,\"sufferedGoals\":0,\"saves\":0,\"powersUsed\":0},\"maxSpeed\":353.5533905932738}"
  }
]
```

- **Get a specific match:** `GET /matches/:id`

### Response example

```json
{
  "mode": "CRAZY", // CLASSIC
  "user1Id": "v532dt5f-5000-440e-ae20-20d2fa732see",
  "user2Id": "b3d2f55f-5000-440e-ae20-20d2fa732see",
  "user1Character": "PIKACHU",
  "user2Character": "MARIO",
  "user1Alias": "chris",
  "user2Alias": "anna",
  "createdAt": "2025-06-04T09:57:41.096Z",
  "stats": "{\"left\":{\"goals\":0,\"sufferedGoals\":5,\"saves\":0,\"powersUsed\":0},\"right\":{\"goals\":5,\"sufferedGoals\":0,\"saves\":0,\"powersUsed\":0},\"maxSpeed\":353.5533905932738}"
}
```

## Tournaments

- **Get a specific tournament:** `GET /tournaments/:id`

### Response example

```json
{
  "id": "v532dt5f-5000-440e-ae20-20d2fa732see",
  "userAlias": "chris",
  "avatarPath": "avatar/avatar.png",
  "quarterFinalScore": 5, // or ''
  "semiFinalScore": 5, // or ''
  "finalScore": 3 // or ''
}
```

- **Get user's latest 3 tournaments:** `GET /tournaments/user:id`

### Response example

```json
{
  "tournamentId": "7f32dt5f-5000-440e-ae20-20d2fa732see",
  "tournamentType": "CRAZY", // or CLASSIC
  "position": "Final" // or 'Semi-final', 'Quarter-final', 'Tournament Winner!'
}
```

### Notes

- **Protected routes** require the `access_token` cookie to be set.
- **Ensure `Content-Type: application/json`** is included in `POST` and `PATCH` requests.
- **Replace base API URL** (`backend:3000/api`) with `localhost:3000` if running locally.

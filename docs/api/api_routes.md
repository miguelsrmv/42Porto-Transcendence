# Endpoints

| Method   | Route                     |   URL parameters    |             Body              | Description                                |
| -------- | ------------------------- | :-----------------: | :---------------------------: | ------------------------------------------ |
| `GET`    | `/`                       |                     |                               | Base route for test                        |
| `GET`    | `/users`                  |                     |                               | Get all users                              |
| `GET`    | `/users/:id`              |    `id` user id     |                               | Get a specific user                        |
| `POST`   | `/users`                  |                     | username, email and password  | Create a new user                          |
| `PUT`    | `/users/:id`              |    `id` user id     |        data to update         | Update data on a specific user             |
| `DELETE` | `/users/:id`              |    `id` user id     |                               | Delete a user                              |
| `POST`   | `/users/login`            |                     |      email and password       | Get JWT (if user is valid)                 |
| `GET`    | `/players`                |                     |                               | Get all players                            |
| `GET`    | `/players/:id`            |   `id` player id    |                               | Get a specific player                      |
| `PUT`    | `/players/:id`            |   `id` player id    |        data to update         | Update data on a specific player           |
| `GET`    | `/players/:id/friends`    |   `id` player id    |                               | Get all friends of that player             |
| `POST`   | `/friends`                |                     |     playerId and friendId     | Create a friendship between two players    |
| `PUT`    | `/friends/:id`            | `id` friendship id  |            status             | Update friendship status                   |
| `DELETE` | `/friends/:id`            | `id` friendship id  |                               | Delete a friendship                        |
| `GET`    | `/matches`                |                     |                               | Get all matches                            |
| `GET`    | `/matches/player/:id`     |   `id` player id    |                               | Get all matches from a specific player     |
| `GET`    | `/matches/:id`            |    `id` match id    |                               | Get a specific match                       |
| `POST`   | `/matches`                |                     |    player1Id and player2Id    | Create a match                             |
| `PUT`    | `/matches/:id`            |    `id` match id    |        data to update         | Update data on a specific match            |
| `GET`    | `/tournaments`            |                     |                               | Get all tournaments                        |
| `GET`    | `/tournaments/player/:id` |   `id` player id    |                               | Get all tournaments from a specific player |
| `GET`    | `/tournaments/:id`        | `id` tournaments id |                               | Get a specific tournament                  |
| `POST`   | `/tournaments`            |                     | maxParticipants and createdBy | Create a tournament                        |
| `PUT`    | `/tournaments/:id`        | `id` tournaments id |        data to update         | Update data on a specific tournament       |

## Base

When making requests to the API through the Docker container, the base API endpoint is
`http://backend:3000/api` 'backend' being the name of the container running the API and '3000' being the chosen port for communication with it.  
If running the app locally (e.g. `npx tsx server.ts`), the endpoint is `http://localhost:3000/`

## Users

- **Get all users:** `GET /users`
- **Get a specific user:** `GET /users/:id`
- **Create a new user:** `POST /users`

```json
{
  "username": "new_user_name",
  "email": "new_user@email.com",
  "password": "password"
}
```

- **Update a user:** `PUT /users/:id`

```json
{
  "username": "new_user_name", // optional
  "email": "new_user@email.com" // optional
}
```

- **Delete a user:** `DELETE /users/:id`
- **User login (Get JWT):** `POST /users/login`

```http
POST http://localhost:3000/users/login HTTP/1.1
Content-Type: application/json

{
	"email": "test@gmail.com",
	"password": "secure123"
}

```

**Response:** (if the login data is correct and the user exists in the database)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInCI6I.eyJwYXlImVtYWlsIbWFpbC5jLCJ1c2VyTmFtZSiaWF0.JwQiR3SOzVbsc7QmR-oM_GaNIB6kXhC"
}
```

**Usage in Authorization Header:**

```http
GET http://localhost:3000/<protected_route> HTTP/1.1
Authorization: Bearer <JWT>

```

## Players

- **Get all players:** `GET /players`
- **Get a specific player:** `GET /players/:id`
- **Update a player:** `PUT /players/:id`

```json
{
  "name": "John Smith", // optional
  "bio": "Hello everyone!" // optional
}
```

## Friendships

- **Get all friendships for a player:** `GET /players/:id/friends`
- **Create a new friendship:** `POST /friends`

```json
{
  "playerId": "<id>",
  "friendId": "<id>"
}
```

- **Delete a friendship:** `DELETE /friends/:id`
- **Update a friendship status:** `PUT /friends/:id`

```json
{
  "status": "PENDING" // or "ACCEPTED", "BLOCKED"
}
```

## Matches

- **Get all matches:** `GET /matches`
- **Get all matches from a specific player:** `GET /matches/player/:id`
- **Get a specific match:** `GET /matches/:id`
- **Create a new match:** `POST /matches`

```json
{
  "player1Id": "<id>",
  "player2Id": "<id>",
  "settings": "{\"map\":\"map3\",\"allowPowerUps\":true,\"ballSpeed\": 1.3,\"rounds\":5}" // optional settings
}
```

- **Update a match:** `PUT /matches/:id`

```json
{
  "duration": 120, // in seconds
  "winnerId": "<id>",
  "player1Score": 3,
  "player2Score": 2
}
```

## Tournaments

- **Get all tournaments:** `GET /tournaments`
- **Get all tournaments from a specific player:** `GET /tournaments/player/:id`
- **Get a specific tournament:** `GET /tournaments/:id`
- **Create a new tournament:** `POST /tournaments`

```json
{
  "maxParticipants": 4,
  "createdBy": "<id>",
  "name": "Tournament1", // optional
  "settings": "{\"map\":\"map3\",\"allowPowerUps\":true,\"ballSpeed\": 1.3,\"rounds\":5}" // optional settings
}
```

- **Update a tournament:** `PUT /tournaments/:id`

```json
{
  "status": "ACTIVE", // or "PENDING", or "COMPLETED"
	"currentRound": 2,
}
```

### Notes

- **Protected routes** require the `Authorization: Bearer <JWT>` header.
- **Ensure `Content-Type: application/json`** is included in `POST` and `PUT` requests.
- **Replace base API URL** (`backend:3000/api`) with `localhost:3000` if running locally.

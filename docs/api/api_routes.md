# Endpoints

| Method   | Route                   |   URL parameters   |             Body             | Description                              |
| -------- | ----------------------- | :----------------: | :--------------------------: | ---------------------------------------- |
| `GET`    | `/`                     |                    |                              | Base route for test                      |
| `GET`    | `/users`                |                    |                              | Get all users                            |
| `GET`    | `/users/:id`            |    `id` user id    |                              | Get a specific user                      |
| `POST`   | `/users`                |                    | username, email and password | Create a new user                        |
| `PUT`    | `/users/:id`            |    `id` user id    |        data to update        | Update data on a specific user           |
| `DELETE` | `/users/:id`            |    `id` user id    |                              | Delete a user                            |
| `POST`   | `/users/login`          |                    |      email and password      | Get JWT (if user is valid)               |
| `GET`    | `/profiles`             |                    |                              | Get all profiles                         |
| `GET`    | `/profiles/:id`         |  `id` profile id   |                              | Get a specific profile                   |
| `PUT`    | `/profiles/:id`         |  `id` profile id   |        data to update        | Update data on a specific profile        |
| `GET`    | `/profiles/:id/friends` |  `id` profile id   |                              | Get all friends of that profile          |
| `POST`   | `/friends`              |                    |    profileId and friendId    | Create a friendship between two profiles |
| `PUT`    | `/friends/:id`          | `id` friendship id |            status            | Update friendship status                 |
| `DELETE` | `/friends/:id`          | `id` friendship id |                              | Delete a friendship                      |

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

## Profiles

- **Get all profiles:**  `GET /profiles`
- **Get a specific profile:** `GET /profiles/:id`
- **Update a profile:** `PUT /profiles/:id`

```json
{
  "name": "John Smith", // optional
  "bio": "Hello everyone!" // optional
}
```

## Friendships

- **Get all friendships for a profile:** `GET /profiles/:id/friends`
- **Create a new friendship:** `POST /friends`

```json
{
  "friendId": "<id>",
  "profileId": "<id>"
}
```

- **Delete a friendship:** `DELETE /friends/:id`
- **Update a friendship status:** `PUT /friends/:id`

```json
{
  "status": "pending" // or "accepted", "blocked"
}
```

### Notes

- **Protected routes** require the `Authorization: Bearer <JWT>` header.
- **Ensure `Content-Type: application/json`** is included in `POST` and `PUT` requests.
- **Replace base API URL** (`backend:3000/api`) with `localhost:3000` if running locally.

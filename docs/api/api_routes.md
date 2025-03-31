# Endpoints

| Method   | Route                    |   URL parameters   |             Body             | Description                              |
| -------- | ------------------------ | :----------------: | :--------------------------: | ---------------------------------------- |
| `GET`    | `/`                      |                    |                              | Base route for test                      |
| `GET`    | `/users`                 |                    |                              | Get all users                            |
| `GET`    | `/users/:id`             |    `id` user id    |                              | Get a specific user                      |
| `POST`   | `/users/create`          |                    | username, email and password | Create a new user                        |
| `PUT`    | `/users/:id`             |    `id` user id    |        data to update        | Update data on a specific user           |
| `DELETE` | `/users/:id`             |    `id` user id    |                              | Delete a user                            |
| `POST`   | `/users/login`           |                    |      email and password      | Get JWT (if user is valid)               |
| `GET`    | `/profiles`              |                    |                              | Get all profiles                         |
| `GET`    | `/profiles/:id`          |  `id` profile id   |                              | Get a specific profile                   |
| `PUT`    | `/profiles/:id`          |  `id` profile id   |        data to update        | Update data on a specific profile        |
| `GET`    | `/profiles//:id/friends` |  `id` profile id   |                              | Get all friends of that profile          |
| `POST`   | `/friends`               |                    |    profileId and friendId    | Create a friendship between two profiles |
| `PUT`    | `/friends/:id`           | `id` friendship id |            status            | Update friendship status                 |
| `DELETE` | `/friends/:id`           | `id` friendship id |                              | Delete a friendship                      |

## Base

When making requests to the API through the Docker container, the base API endpoint is
`http://backend:3000/api` 'backend' being the name of the container running the API and '3000' being the chosen port for communication with it.  
If running the app locally (e.g. `npx tsx server.ts`), the endpoint is `http://localhost:3000/`

## Users

- To get all users in the database (GET), the endpoint is `http://backend:3000/api/users`
- To get data on a specific user by ID (GET), the endpoint is `http://backend:3000/api/users/:id`
- To create a new user (POST), the endpoint is `http://backend:3000/api/users/create` and the schema for the JSON data is

```json
{
  "username": "new_user_name",
  "email": "new_user@email.com",
  "password": "password"
}
```

- To update user data (PUT), the endpoint is `http://backend:3000/api/users/:id` and the schema for the JSON data is

```json
{
  "data": {
    "username": "new_user_name", // optional
    "email": "new_user@email.com" // optional
  }
}
```

- To delete a user from the database (DELETE), the endpoint is `http://backend:3000/api/users/:id`
- To login user (get JWT) (POST), the endpoint is `http://backend:3000/api/users/login` and (if the login data is correct and the user exists in the database) will return a token that is required in the headers when making requests to protected routes.  
  Example request:

```http
POST http://localhost:3000/users/login HTTP/1.1
content-type: application/json

{
	"email": "test@gmail.com",
	"password": "secure123"
}

```

The response will contain a json token (JWT) similar to the one bellow:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInCI6I.eyJwYXlImVtYWlsIbWFpbC5jLCJ1c2VyTmFtZSiaWF0.JwQiR3SOzVbsc7QmR-oM_GaNIB6kXhC"
}
```

This token then needs to be used in subsequent requests to protected routes in the `Authorization` header, like so:

```http
GET http://localhost:3000/<protected_route> HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInCI6I.eyJwYXlImVtYWlsIbWFpbC5jLCJ1c2VyTmFtZSiaWF0.JwQiR3SOzVbsc7QmR-oM_GaNIB6kXhC

```

## Profiles

- To get all profiles in the database (GET), the endpoint is `http://backend:3000/api/profiles`
- To get data on a specific profile by ID (GET), the endpoint is `http://backend:3000/api/profiles/:id`
- To update a profile's data (PUT), the endpoint is `http://backend:3000/api/profiles/:id` and the schema for the JSON data is

```json
{
  "data": {
    "name": "John Smith", // optional
    "bio": "Hello everyone!" // optional
  }
}
```

## Friendships

- To get all friendships associated with a profile (GET), the endpoint is `http://backend:3000/api/profiles/:id/friends`
- To create a new friendship between two profiles (POST), the endpoint is `http://backend:3000/api/friends` and the schema for the JSON data is

```json
{
  "friendId": "<id>",
  "profileId": "<id>"
}
```

- To delete a friendship (DELETE), the endpoint is `http://backend:3000/api/friends/:id`
- To update a friendship status (PUT), the endpoint is `http://backend:3000/api/friends/:id`

**Notes**:

- Don't forget to replace the base api endpoint if you are running it locally;
- `POST` and `PUT` requests need the `content-type: application/json` header;
- Protected routes need the `Authorization: Bearer <JWT>` header;

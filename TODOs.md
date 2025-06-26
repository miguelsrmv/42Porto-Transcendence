# Frontend
- Final match result in tournament not displaying correctly for loser (displaying winner)
- Edit player avatar on match stats show
- Edit accent colour on match stats show
- Edit match stats themselves
- Do something with friends
- Doxygen comments
- Next game button showing on tournament winner
- On Local Tournament: "Upload your avatar" should not be a valid avatar!!
- After 2FA activation, make toggle to be "active" every time the user enters the settings, giving him the option to opt-out
- NGINX POST not allowed error when updating info (sometimes, when testing errors)
- Change avatar button not working on "Upload your design"
- Send DELETE request when declining friendship instead of marking as Rejected? (How to manage rejected friendships?)

# Backend
- join_game on WS connection?
- Deal with re-connections and lag? (player_lagging, player_reconnected)

- Review API endpoints' output
 - GET /friends, GET /users/2FA/setup, GET /users/checkLoginStatus, GET /matches/user/:id
- Remove unused functions/routes/types
 - GET /users/isOnline/:id
- Organize functions in each file
- Test security
- Add more tests
- Remove populate from running automatically on project delivery

# Global
- Update documentation
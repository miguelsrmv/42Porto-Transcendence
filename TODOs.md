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
- When a request to checkLoginStatus fails due to timeout, user turns to guest (local storage cleared) but cookie remains (logged in)

# Backend
- Review API endpoints' output
 - GET /friends, GET /users/2FA/setup, GET /users/checkLoginStatus, GET /matches/user/:id
- Change route HTTP methods
 - DELETE /logout, PUT /defaultAvatar, and PUT /customAvatar to PATCH
- Remove populate from running automatically on project delivery

# Global
- Update documentation
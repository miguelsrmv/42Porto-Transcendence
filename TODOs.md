# Frontend
- When submitting empty username, no error and header gets updated
- If change username and not insert oldPassword (click outside box), it changes in the header
- If change email and not insert oldPassword (click outside box), username in the header disappears
- If no oldPassword input and click confirm, crash (cannot get out of box until right password is submitted and then get a 405 from NGINX)

# Backend
- Make responses more uniform
- Protect all routes in the end (except login/sign up related)
- Test server-side pong through CLI
- Test waiting player to remote and then remove a player in the match. Does the third player go into the match?
- Tournament brackets management
- Connect tournament logic to Blockchain
- Check user stats match leaderboard
- Review player id/socket management in game sessions to check if player is present
- Add ready for next round logic
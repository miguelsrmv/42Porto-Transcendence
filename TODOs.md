# Frontend
- When submitting '' as username, no error and header gets updated
- If change username and not insert oldPassword (click outside box), it changes in the header
- If change email and not insert oldPassword (click outside box), username in the header disappears
- If no oldPassword input and click confirm, crash (cannot get out of box until right password is submitted and then get a 405 from NGINX)

# Backend
- Deal with receiving ready_for_next_game before round ends
- Add ready for next round logic (game_end -> display stats -> client sends ready_for_next_game -> "waiting for next game" -> once every winner sent ready_for_next_game, send tournament_status -> display status -> 10s later send game_start)
- Connect tournament logic to Blockchain (in progress)
- Tournament brackets management
- Check user stats match leaderboard

- Add centralized manager class that instantiates either tournaments or sessions ?
- Review player id/socket management in game sessions to check if player is present
- Uniformize search by socket or playerId
- Deal with re-connections and lag 
- Review heartbeat times

- Parse player settings ?
- Make responses more uniform
- Protect all routes in the end (except login/sign up related)
- Remove populate from running automatically on project delivery
# Frontend

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

NEW:
- Can only access first set of games in a tournament (I don't get tournament status nor game start afterwards)
- Sometimes, it feels like not all players are disconnected from a tournament (see Slack screenshot for evidence)
- Missing Tournament IDs so I can ask for tournament information on Rankings page
- Missing number of tournaments won by each player

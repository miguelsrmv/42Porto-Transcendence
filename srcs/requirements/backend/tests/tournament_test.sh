#!/bin/bash

for i in {1..8}
do
  user="user$i"
  
  message="{\"type\":\"join_game\",\"playerSettings\":{\"playerID\":\"$user\",\"playType\":\"Tournament Play\",\"gameType\":\"Crazy Pong\",\"alias\":\"test5\",\"paddleColour\":\"#ff0000\","character\":{\"name\":\"Link\",\"attack\":\"Gale Boomerang\",\"characterSelectPicturePath\":\"../../../../static/character_select/link.png\",\"characterAvatarPicturePath\":\"../../../../static/character_portrait/link.png\",\"accentColour\":\"cyan\",\"selectHelpMessage\":\"Invert the ball's trajectory!\"}}}"
  
  echo "$message" | websocat "ws://localhost:8080/ws/tournament" &
done

wait

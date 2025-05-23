#!/bin/bash

for i in {1..8}
do
  user="user$i"
  
  message="{\"type\": \"join_game\", \"user\": \"$user\"}"
  "{\"type\":\"join_game\",\"playerSettings\":{\"playerID\":\"89cad821-efd8-466e-b0f7-e260052b9a8c\",\"playType\":\"Tournament Play\",\"gameType\":\"Crazy Pong\",\"alias\":\"test5\",\"paddleColour\":\"#ff0000\","character\":{\"name\":\"Link\",\"attack\":\"Gale Boomerang\",\"characterSelectPicturePath\":\"../../../../static/character_select/link.png\",\"characterAvatarPicturePath\":\"../../../../static/character_portrait/link.png\",\"accentColour\":\"cyan\",\"selectHelpMessage\":\"Invert the ball's trajectory!\"}}}"
  
  echo "$message" | websocat "ws://localhost:8080/ws" &
done

wait

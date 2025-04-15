#!/bin/sh
PRIVATE_KEY=$(cat /run/secrets/tournament_key)

chown foundry:foundry /output

forge script script/DeployTournamentsStorage.s.sol:DeployTournamentsStorage \
    --chain 43113 \
    --rpc-url https://api.avax-test.network/ext/bc/C/rpc \
    --private-key $PRIVATE_KEY \
    --broadcast --verify -vvvv \
| tee /output/deploy.log

grep '0: contract TournamentsStorage' /output/deploy.log | awk '{print $4}' > /output/blockchain_address.txt

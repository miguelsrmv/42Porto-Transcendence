#!/bin/sh

chown foundry:foundry /output

forge script script/DeployTournamentsStorage.s.sol:DeployTournamentsStorage \
    --chain 43113 \
    --rpc-url $AVALANCHE_FUJI_TESTNET_RPC_URL \
    --account tournamentKey \
    --sender 0x425Dc61294C00b7822EC3dbf6d77819a858cfBf5 \
    --broadcast --verify -vvvv \
| tee /output/deploy.log

grep '0: contract TournamentsStorage' /output/deploy.log | awk '{print $4}' > /output/blockchain_address.txt

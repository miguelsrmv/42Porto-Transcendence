#!/bin/sh
# Uncomment the following line to deploy the contract on Avalanche Fuji Testnet
PRIVATE_KEY=$(cat /run/secrets/private_key)

chown foundry:foundry /output

# Uncomment the following command to deploy the contract on Avalanche Fuji Testnet
forge script script/DeployTournamentsStorage.s.sol:DeployTournamentsStorage \
    --chain 43113 \
    --rpc-url https://api.avax-test.network/ext/bc/C/rpc \
    --private-key $PRIVATE_KEY \
    --broadcast --verify -vvv \
| tee /output/deploy.log

# Uncomment the following command to deploy the contract on Anvil (Foundry)
# forge script script/DeployTournamentsStorage.s.sol:DeployTournamentsStorage \
#     --broadcast --verify -vvv \
# | tee /output/deploy.log

grep '0: contract TournamentsStorage' /output/deploy.log | awk '{print $4}' > /output/blockchain_address.txt
rm -rf /output/deploy.log

CONTRACT_ADDRESS=$(cat /output/blockchain_address.txt)

forge verify-contract \
    $CONTRACT_ADDRESS \
    src/TournamentsStorage.sol:TournamentsStorage \
    --verifier etherscan \
    --verifier-url https://api.routescan.io/v2/network/testnet/evm/43113/etherscan \
    --etherscan-api-key verifyContract \
    --num-of-optimizations 200 \
    --compiler-version 0.8.30 \
    --chain-id 43113
FROM ghcr.io/foundry-rs/foundry:stable

WORKDIR /home/foundry/blockchain

COPY ./srcs/requirements/blockchain/tools/contracts/ .
COPY ./srcs/requirements/blockchain/conf/keystores/tournamentKey /home/foundry/.foundry/keystores/tournamentKey
COPY ./srcs/requirements/blockchain/deploy.sh .

USER root
RUN chmod +x deploy.sh
RUN chown -R foundry:foundry /home/foundry
RUN git config --global --add safe.directory /home/foundry/blockchain
USER foundry

WORKDIR /home/foundry/blockchain/TournamentsStorage

RUN forge test

ENTRYPOINT ["/bin/sh", "/home/foundry/blockchain/deploy.sh"]

# docker build -t blockchain -f srcs/requirements/blockchain/Dockerfile .

# docker run -it --rm -e AVALANCHE_FUJI_TESTNET_RPC_URL="https://api.avax-test.network/ext/bc/C/rpc" -v $PWD/output:/output blockchain 

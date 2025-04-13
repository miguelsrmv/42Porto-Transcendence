FROM ghcr.io/foundry-rs/foundry:stable

WORKDIR /home/foundry/blockchain

COPY . .

USER root
RUN chown -R foundry:foundry /home/foundry/blockchain
RUN git config --global --add safe.directory /home/foundry/blockchain
USER foundry

WORKDIR /home/foundry/blockchain/srcs/requirements/blockchain/tools/contracts/TournamentsStorage

RUN forge test

CMD ["forge", "build"]

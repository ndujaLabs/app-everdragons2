FROM node:16-slim
RUN npm install -g pnpm webpack webpack-cli

COPY --chown=node:node . /home/node
USER node
WORKDIR /home/node

RUN pnpm install
RUN pnpm build

ENTRYPOINT pnpm start

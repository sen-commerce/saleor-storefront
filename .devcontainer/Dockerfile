FROM mcr.microsoft.com/devcontainers/typescript-node:20

RUN corepack enable && corepack prepare pnpm@10 --activate

USER 1000:1000
WORKDIR /app

COPY --chown=1000:1000 package.json pnpm-lock.yaml ./
COPY --chown=1000:1000 pnpm-workspace.yaml* ./
RUN --mount=type=cache,mode=0700,uid=1000,gid=1000,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY --chown=1000:1000 . .

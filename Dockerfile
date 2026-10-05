# Dockerfile for Mapa de Risco da UNILAB
#
# Maintainer: Erivando Sena <erivandosena@gmail.com>
#
# Description: Este Dockerfile cria uma imagem para Microsserviço,
# um aplicativo da Web escrito em React.
#
# Build instructions:
#   docker build -f ./Dockerfile \
#     -t harbor.unilab.edu.br/unilab/uniselec-adminunilab:latest \
#     --build-arg VERSION=1.0.0 \
#     --build-arg COMMIT_SHA=$(git rev-parse --short HEAD) \
#     --no-cache ./source/
#   docker push harbor.unilab.edu.br/unilab/uniselec-adminunilab:latest
#
# Usage:
#   docker run -it --rm -d -p 8088:80 --name uniselec-admin \
#     harbor.unilab.edu.br/unilab/uniselec-adminunilab:latest
#   docker logs -f --tail --until=2s uniselec-admin
#   docker exec -it uniselec-admin bash
#   docker inspect --format='{{json .Config.Labels}}' \
#     harbor.unilab.edu.br/unilab/uniselec-adminunilab:latest | jq .
#
#
# Environment variables:
#   COMMIT_SHA: o hash SHA-1 de um determinado commit do Git.
#   VERSION: usado na tag de imagem ou como parte dos metadados da mesma.
#
# Notes:
# - Este Dockerfile assume que o código do aplicativo está localizado
#   no diretório ./source
# - O aplicativo pode ser acessado em um navegador da Web em
#   https://uniselec-admin.unilab.edu.br/
#
# Version: 1.0

# Stage de build
FROM node:22-bookworm AS build
WORKDIR /app

# Copia manifests e instala dependências
COPY package*.json ./
RUN yarn install --frozen-lockfile

# Copia todo o código e gera o build
COPY . .
RUN yarn build

# Stage de produção
FROM nginx:bookworm

ARG COMMIT_SHA
ARG VERSION

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    software-properties-common \
    unzip \
    jq \
    nano \
    wget \
    curl \
    rsync \
    telnet \
    iputils-ping \
 && rm -rf /var/lib/apt/lists/*

# Instala Vault e VaultEnv
# Quando tiver vault
ENV VAULT_ADDR=http://dti-vault.unilab.edu.br
RUN curl -o vault.zip -k https://releases.hashicorp.com/vault/1.13.3/vault_1.13.3_linux_amd64.zip \
 && unzip vault.zip vault \
 && mv vault /usr/local/bin/ \
 && rm vault.zip

RUN curl -sL -o vaultenv \
     https://github.com/channable/vaultenv/releases/download/v0.15.1/vaultenv-0.15.1-linux-musl \
 && mv vaultenv /usr/local/bin/ \
 && chmod +x /usr/local/bin/vaultenv



# Copia build do React e configura nginx
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/ ./
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

LABEL \
  org.opencontainers.image.vendor="UNILAB" \
  org.opencontainers.image.title="Official Node image" \
  org.opencontainers.image.description="Mapa de Gestão de Risco da UNILAB" \
  org.opencontainers.image.version="${VERSION}" \
  org.opencontainers.image.url="https://uniselec-admin.unilab.edu.br/" \
  org.opencontainers.image.source="http://dti-gitlab.unilab.edu.br/dti/uniselec-admin.git" \
  org.opencontainers.image.licenses="N/D" \
  org.opencontainers.image.author="Jeff Ponte" \
  org.opencontainers.image.company="Universidade da Integracao Internacional da Lusofonia Afro-Brasileira (UNILAB)" \
  org.opencontainers.image.maintainer="DTI/Unilab"

CMD ["nginx", "-g", "daemon off;"]

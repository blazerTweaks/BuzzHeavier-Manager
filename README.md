# BuzzHeavier Manager

Interface web pessoal para gerenciar seus arquivos no BuzzHeavier.

## Funcionalidades

- 📁 Navegação por pastas com breadcrumb
- 📊 Stats da pasta atual (total de arquivos, tamanho, expirando em breve)
- ⏳ Badge de expiração colorido (verde / amarelo / vermelho)
- 🔍 Filtro em tempo real por nome
- ↕️ Ordenação por nome, tamanho, data, expiração
- ✏️ Renomear arquivos e pastas
- 🗑️ Deletar arquivos e pastas
- 📝 Adicionar nota a arquivos
- 📂 Criar novas pastas
- 🔗 Copiar link direto do arquivo
- 💾 API key salva localmente (não sai ao fechar)

## Stack

- Vite + React 18
- Lucide React (ícones)
- BuzzHeavier API (REST)

## Setup

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` e insira seu **Account ID** do BuzzHeavier
(disponível em https://buzzheavier.com/settings).

## Deploy em produção

O servidor Node.js (`server.js`) serve os arquivos estáticos e faz proxy das requisições
para a API do BuzzHeavier, resolvendo o CORS.

### Build + Start

```bash
npm run build
npm start
```

O servidor roda na porta definida por `PORT` (padrão: 3000).

### Deploy em plataformas (Railway, Render, Fly.io, etc)

1. Conecte o repositório na plataforma
2. Comando de build: `npm run build`
3. Comando de start: `npm start`
4. A plataforma geralmente define a variável `PORT` automaticamente

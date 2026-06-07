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

### Vercel (recomendado)

1. Faça o deploy do repositório no Vercel
2. Framework: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. As rotas `/api/*` e `/upload/*` são automaticamente proxyadas via serverless function (`api/proxy.js`)

### Railway / Render / Fly.io

```bash
npm run build
npm start
```

O servidor roda na porta definida por `PORT` (padrão: 3000).

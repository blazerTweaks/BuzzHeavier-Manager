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

## Deploy

### 1. Criar o Worker (proxy)

1. Acesse https://dash.cloudflare.com → **Workers & Pages** → **Create Worker**
2. Copie o conteúdo de [`worker.js`](./worker.js) e cole no editor
3. Clique em **Deploy**
4. Anote a URL do Worker: `https://buzzheavier-proxy.seu-user.workers.dev`

### 2. Configurar o Frontend (Pages)

1. Em **Workers & Pages** → **Pages** → **Connect to Git**
2. Escolha o repositório `blazerTweaks/BuzzHeavier-Manager`
3. Configure:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Vá em **Settings** → **Environment Variables** e adicione:
   - **Nome**: `VITE_API_URL`
   - **Valor**: `https://buzzheavier-proxy.seu-user.workers.dev`
5. Volte em **Deployments** e clique em **Retry deploy**

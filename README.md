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

## Deploy (Cloudflare Pages)

1. Acesse https://dash.cloudflare.com → **Workers & Pages** → **Pages** → **Connect to Git**
2. Escolha o repositório `blazerTweaks/BuzzHeavier-Manager`
3. Configure:
   - **Project name**: `buzzheavier-manager` (ou qualquer nome)
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Clique em **Save and Deploy**
5. Após o deploy, seu site estará em `https://buzzheavier-manager-1234.pages.dev`

O `functions/[[path]].js` faz proxy de `/api/*` → `buzzheavier.com` e `/upload/*` → `w.buzzheavier.com` automaticamente.

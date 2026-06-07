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

## Deploy em produção (Cloudflare Pages)

Cloudflare Pages resolve o CORS nativamente com Functions — sem servidor, sem configuração.

1. Crie uma conta em https://dash.cloudflare.com
2. Vá em **Workers & Pages** → **Pages** → **Connect to Git**
3. Conecte o repositório `blazerTweaks/BuzzHeavier-Manager`
4. Configure:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Clique em **Save and Deploy**

O arquivo `public/_worker.js` é automaticamente implantado como um Cloudflare Worker, fazendo proxy de `/api/*` → `buzzheavier.com` e `/upload/*` → `w.buzzheavier.com`, servindo assets estáticos e roteando SPA.

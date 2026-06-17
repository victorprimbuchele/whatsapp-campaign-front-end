# wp-campaign-fe

Frontend da plataforma de campanhas WhatsApp, construído com [Next.js](https://nextjs.org/) (App Router), React Query, Zustand e shadcn/ui.

A aplicação roda em ambiente **dockerizado** e se conecta ao back-end [`wp-campaign-be`](../wp-campaign-be) via variável de ambiente `NEXT_PUBLIC_API_URL`.

## Inicialização do Projeto

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd <repositorio>
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

**Desenvolvimento local (sem Docker no front):** use `http://localhost:3004` como `NEXT_PUBLIC_API_URL`.

### 3. Subir os containers (back-end primeiro)

```bash
# 1. Na pasta do back-end
docker compose up --build -d

# 2. Na pasta do front-end
docker compose up --build
```

Para rodar em segundo plano:

```bash
docker compose up --build -d
```

A aplicação ficará disponível em `http://localhost:3001`.

### 4. Verificar os serviços

```bash
docker compose ps
docker compose logs -f frontend
```

---

## Desenvolvimento Local (sem Docker no front)

Se preferir rodar o Next.js diretamente na máquina, mantenha apenas a infraestrutura no Docker:

```bash
# Subir o back-end completo
cd ../wp-campaign-be && docker compose up -d

# Instalar dependências e iniciar o front localmente
cd ../whatsapp-campaign-front-end
npm install
npm run dev
```

Nesse cenário, configure `NEXT_PUBLIC_API_URL=http://localhost:3004` no `.env.local`.

## Estrutura do Projeto

```
app/
├── campanhas/
│   ├── [id]/          # Página de detalhes de campanha
│   ├── nova/          # Wizard de criação de campanha
│   └── page.tsx       # Listagem de campanhas
├── hooks/             # React Query hooks (useCampaigns, useDeleteCampaign, useTemplates…)
├── lib/               # query-client.ts, utils.ts
├── services/          # Camada de acesso à API (campaignService, templateService…)
├── stores/            # Stores Zustand (useCampaignStore, useWizardStore, useUserStore)
├── types/             # Tipos TypeScript compartilhados
├── providers.tsx      # QueryClientProvider + outros providers
└── layout.tsx

components/
├── campaigns/         # Componentes específicos de campanhas
├── shared/            # Componentes reutilizáveis (modais, tabelas, paginação…)
└── ui/                # Componentes shadcn/ui

constants/
└── auth.ts            # CURRENT_USER_ID (stub de autenticação)

cypress/
├── component/         # Testes de componente isolados
├── e2e/               # Testes end-to-end
├── fixtures/
└── support/
```

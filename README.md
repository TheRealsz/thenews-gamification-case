# Gamificação the news

Um projeto de gamificação para aumentar o engajamento dos leitores do newsletter **the news**. Inspirado em plataformas como o Duolingo, o sistema premia os usuários que mantêm uma sequência (streak) de aberturas diárias das newsletters, exibindo estatísticas pessoais, informações de engajamento e mensagens motivacionais. Também há um dashboard administrativo para monitorar métricas e acompanhar insights tanto de usuários quanto de newsletters

---

## Visão Geral

O projeto tem como objetivo aumentar o engajamento dos leitores do newsletter **the news** através de gamificação. A ideia central é:

- Registrar a abertura das newsletters via webhook.
- Calcular e exibir a sequência (streak) de dias consecutivos que o usuário abriu as newsletters (com exceção de domingos, quando não há envio).
- Exibir estatísticas e mensagens motivacionais personalizadas na área logada dos leitores.
- Oferecer um dashboard administrativo que permita visualizar métricas gerais, ranking dos leitores mais engajados, com maiores streaks e com mais dias com leitura. Além disso, existe uma dashboard focada nas newsletters, apresentando gráficos de aberturas por periodos diarios, semanais e mensais.

---

## Funcionalidades

### Área Logada para Leitores

- **Login via Email**: Os usuários podem acessar a área logada através de um link com o email como parâmetro (auto-login) ou pela pagina de login.
- **Exibição de Streaks**: Mostra o streak atual, melhor streak, percentual de dias lidos e totais de dias lidos no mes.
- **Mensagens Motivacionais**: Mensagens e emojis que incentivam a continuidade da leitura.
- **Calendário Interativo**: Um calendário customizado (usando react-day-picker) que exibe um emoji de fogo para dias lidos e um de gelo para os dias não lidos.

### Dashboard Administrativo

- **Métricas Gerais**: Total de aberturas e média de streaks.
- **Ranking dos Leitores**: Lista dos leitores ordenados por streak, melhor streak ou total de dias lidos.
- **Filtros**: Possibilidade de filtrar por streak, melhor streak ou total de dias lidos, do maior para o menor ou do menor para o maior.
- **Gráficos de Engajamento**: Visualizações dos dados sobre a abertura de newsletters em gráficos.

### Webhook e Processamento de Dados

- **Webhook de Abertura**: Um endpoint que recebe os parâmetros via GET (email, id da newsletter, UTMs) e registra o evento.
- **Lógica de Streak**: Cálculo que leva em conta a data (em UTC) para atualizar o streak do usuário, tratando exceções (por exemplo, se ontem foi domingo, considera o dia anterior).
- **Atualização de Dados**: O sistema atualiza os contadores tanto para o usuário (streak, best streak, total dias lidos) quanto para a newsletter (total aberto).

---

## Tecnologias Utilizadas

- **Frontend**:
    - React
    - TypeScript
    - Shadcn/ui (componentes baseados em Tailwind CSS)
    - react-day-picker para o calendário customizado
    - Tailwind CSS
- **Backend**:
    - Cloudflare Workers
    - Hono
    - Drizzle ORM
    - SQLite (Cloudflare D1) como banco de dados
- **Ferramentas**:
    - Wrangler (para gerenciamento e deploy dos Workers e D1)
    - Vite (para o desenvolvimento do frontend)

---

## Arquitetura e Stack

A aplicação está estruturada em um **monorepo** ou em pastas separadas para o **frontend** e **backend**. O backend roda em Cloudflare Workers e utiliza o Drizzle ORM para interagir com o banco de dados Cloudflare D1. O frontend em React consome os endpoints do backend e exibe a área logada dos leitores e o dashboard administrativo.

---

## Instalação e Configuração

### Requisitos

- Node.js (versão LTS recomendada)
- Wrangler (para deploy no Cloudflare Workers)
- Acesso ao Cloudflare D1

### Passos para Rodar Localmente

1. **Clonar o Repositório**
    
    ```bash
    git clone https://github.com/TheRealsz/thenews-gamification-case.git
    cd gamificacao-the-news
    ```
    
2. **Configurar Variáveis de Ambiente**
    - Crie um arquivo `.env.local` e defina:
        
        ```bash
        VITE_API_URL="http://localhost:8787/"
        ```
        
    - Configure também o `wrangler.jsonc` com as informações do seu D1:
        
        ```jsonc
        {
            "$schema": "node_modules/wrangler/config-schema.json",
            "name": "thenews-gamification-backend",
            "main": "src/index.ts",
            "compatibility_date": "2025-02-18",
            "compatibility_flags": ["nodejs_compat"],
            "d1_databases": [
                {
                "binding": "DB",
                "database_name": "thenews-gamification",
                "database_id": "", // Preencha com o ID do seu D1, se aplicável.
                "migrations_dir": "drizzle/migrations"
                }
            ]
            // Outras configurações opcionais (como KV, R2, etc.) podem ser adicionadas conforme necessário.
        }
        
        ```
        
3. **Instalar Dependências**
    - No diretório do frontend:
        
        ```bash
        npm install
        
        ```
        
    - No diretório do backend:
        
        ```bash
        npm install
        
        ```
        
4. **Rodar o Projeto Localmente**
    - Frontend:
        
        ```bash
        npm run dev
        
        ```
        
    - Backend (usando Wrangler):
        
        ```bash
        npm run dev
        
        ```
        
---

## Endpoints e API

### Exemplos de Endpoints

- **Auto Login e Dados do Usuário**
    - `GET /user?email=usuario@example.com`
        - Retorna informações do usuário, incluindo streak, best streak, total dias lidos, porcentagem e mensagem motivacional.
- **Registro de Evento (Webhook)**
    - `GET /?email=usuario@example.com&id=post_2025-02-19&utm_source=campanha&utm_medium=email&utm_campaign=campanha`
        - Registra a abertura da newsletter. Se o usuário já leu no mesmo dia (exceto domingos), retorna um erro; caso contrário, atualiza os contadores.
- **Ranking de Métricas**
    - `GET /users/ranking?orderBy=best_streak&order=desc&page=1`
        - Retorna dados agregados para criar as informações de ranking.
- **Estatísticas para Gráficos**
    - O endpoint `/newsletters` filtra por períodos e retorna os dados de cada um, por exemplo:
        - Para o período `week`: retorna os últimos 7 dias agrupados por dia da semana.
        - Para o período `month`: retorna dados agrupados por mês (com nomes dos meses).
        - Para o período `day`: retorna dados agrupados em blocos de horas.

---

## Estrutura do Banco de Dados

### Tabelas Principais

- **users_table**
    - `id`: Identificador único (auto incrementado)
    - `email`: Email do usuário (único)
    - `created_at` e `updated_at`: Timestamps em UTC (salvos como ISOString)
- **webhook_user_readed_newsletters_table**
    - `id`: Identificador único (auto incrementado)
    - `email`: Email do usuário
    - `id_post`: Identificador da newsletter
    - `utm_source`, `utm_medium`, `utm_campaign`, `utm_channel`: Parâmetros de rastreamento
    - `created_at` e `updated_at`: Timestamps em UTC
- **users_streak_table**
    - `id`: Identificador único (auto incrementado)
    - `user_id`: Chave estrangeira referenciando `users_table.id`
    - `streak`: Streak atual
    - `best_streak`: Melhor streak já alcançada
    - `total_days_readed`: Total de dias em que o usuário leu a newsletter
    - `created_at` e `updated_at`: Timestamps em UTC
- **newsletters_table**
    - `id`: Identificador da newsletter
    - `total_opened`: Quantidade de aberturas
    - `created_at` e `updated_at`: Timestamps

---

## Considerações de Segurança

- **Validação e Sanitização**:
    - As entradas (por exemplo, o email recebido por URL) são validadas e sanitizadas para evitar injeção de dados.
- **Uso de HTTPS**:
    - A aplicação deve ser servida via HTTPS, garantindo a segurança dos dados trafegados.
- **Autenticação via Parâmetro e Token**:
    - O sistema possibilita auto login por parâmetro. Em ambiente real, pode-se usar tokens JWT para aumentar a segurança do auto-login.
- **Rate Limiting e Monitoramento**:
    - Implementar limites de requisições para evitar abusos e monitorar logs (utilizando `wrangler tail` para Workers).

---

## Testes e Simulação

- **Testes Manuais**:
    - Utilizado Postman para simular as requisições aos endpoints.
    - Verificação da resposta para diferentes cenários (usuário não encontrado, newsletter já lida, etc).
- **Simulação de Webhook**:
    - Criado URLs de teste para simular a abertura de newsletters, por exemplo:
        
        ```
        https://thenews-gamification-backend.robsondiegoandrade.workers.dev/?email=teste2@exemplo.com&id=post_2025-02-19&utm_source=tech_case&utm_medium=email&utm_campaign=tech_case
        
        ```
        

---

## Desafios e Melhorias Futuras

- **Melhorias na UI/UX**:
    - Aperfeiçoar a interface do calendário e dashboard.
    - Oferecer nome do usuario para referencia-lo na Home page
- **Escalabilidade**:
    - Melhorar a performance das queries SQL e implementar cache para dados.
    - Considerar o uso de serviços de terceiros para monitoramento e logs (por exemplo, Sentry).
    - Considerar utilizar NextJs como framework frontend, visando uso do cache e funcionalidades de SSR.
- **Segurança Adicional**:
    - Implementar autenticação baseada em token para as paginas de administração.
    - Aprimorar a sanitização e validação dos dados de entrada.
- **Funcionalidades Extras**:
    - Sistema de badges e níveis para incentivar o usuário, como recompensas, moedas e lojas para gastar em cosmeticos para sua Home Page.
    - Integração com outras plataformas para aumentar o engajamento.

---

## Contato

- **Nome:** Robson Diego Andrade de Oliveira
- **Email:** Robsondiegoandrade@outlook.com
- **LinkedIn:** https://www.linkedin.com/in/robsondiegoandrade/
- **Github:** https://github.com/TheRealsz
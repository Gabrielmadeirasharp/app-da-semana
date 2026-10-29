# Mini apps · App da Semana

Protótipos de mini apps para Reels. Cada app resolve uma dor de um nicho local (Fortaleza, CE).
Especificação completa: `PROMPT_APP_DA_SEMANA.md`. Status: `PROGRESSO.md` (leia os dois antes de começar).

## Regras de ouro (resumo)
1. Replicável > perfeito. Sem auth, sem banco, sem pagamento.
2. Tudo que muda de cliente fica em `src/config/*.json` (marca, cores, fontes, WhatsApp, produtos, preços, textos, parâmetros).
3. Dados passam por `src/data/repository.ts` (hoje lê JSON; amanhã Supabase/Sheets). `localStorage` só onde faz sentido.
4. Mobile first 390 x 844, no máximo 4 telas principais.
5. Toda jornada termina em `https://wa.me/<numero>?text=<mensagem>` montada a partir de template do config.
6. Marca fictícia com cara de Fortaleza. Nunca marca, logo, foto ou layout de empresa real. Sem personagem licenciado.
7. Rodapé: "Protótipo demonstrativo · valores ilustrativos".
8. pt-BR: `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
9. Visual sem cara de IA: nada de gradiente roxo, glassmorphism, emoji como ícone. Ícones `lucide-react`, Google Fonts com personalidade.
10. Feito para gravar: corpo >= 16px, toques grandes, transições 200-300ms, `?reset=1` limpa o `localStorage`.

## Stack
Vite + React + TypeScript + Tailwind v4 + lucide-react + Vitest. `base: './'`, navegação por hash (`#/tela`).
npm workspaces na raiz (`apps/*`), mas cada app tem o próprio `package.json` e pode ser copiado sozinho.
Novos apps começam copiando `template/`.

## Comandos
- `npm install` (na raiz, uma vez)
- `npm run dev -w apps/01-solar` · `npm run test -w apps/01-solar` · `npm run build -w apps/01-solar`
- `npm run build` (raiz): builda todos os apps prontos em `_site/` (o que vai para o GitHub Pages)
- `npm run screens -- 01-solar`: gera screenshots 390 x 844 em `apps/<app>/docs/` (Playwright)

## Fluxo por app
Pesquisa rápida → `SPEC.md` → código → build + testes + screenshots + conferir mensagem → `README.md` → commit `feat(<slug>): protótipo completo` → `PROGRESSO.md`.

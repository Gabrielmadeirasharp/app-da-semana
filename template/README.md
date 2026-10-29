# template · base dos apps da série

Base extraída do App 01. Todo app novo começa copiando esta pasta.

## Começar um app novo

```bash
cp -r template apps/NN-slug
# edite apps/NN-slug/package.json: "name": "NN-slug"
# edite src/data/repository.ts: PREFIXO_STORAGE = 'slug:'
npm install            # na raiz, para ligar o novo workspace
npm run dev -w apps/NN-slug
```

Depois: `SPEC.md`, configs em `src/config/`, telas em `src/screens/`, cálculos puros com teste em `src/lib/`, roteiro do vídeo em `docs/roteiro.mjs` (para `npm run screens -- NN-slug`).

## O que já vem pronto

| Arquivo | Para quê |
|---|---|
| `src/lib/theme.ts` | Aplica cores (`--cor-*`), fontes do Google Fonts e título a partir de `marca.json` |
| `src/index.css` | Liga as variáveis ao Tailwind (`bg-primaria`, `text-suave`, `font-titulo`…) e o slider grande |
| `src/lib/whatsapp.ts` | `preencherTemplate("Oi {nome}", {nome})`, `linkWhatsApp`, `abrirWhatsApp` |
| `src/lib/format.ts` | `moeda`, `moedaCurta`, `numero`, `data` em pt-BR |
| `src/lib/reset.ts` | `?reset=1` limpa o `localStorage` do app; `lerSalvo`/`salvar` com try/catch |
| `src/lib/router.ts` | `useRota()` e `irPara('tela')` com hash (`#/tela`) |
| `src/components/AppShell.tsx` | Cabeçalho com logo + nome, coluna de celular no desktop, animação de troca de tela |
| `src/components/BarraAcao.tsx` | Barra fixa embaixo com o botão principal e o rodapé "Protótipo demonstrativo" |
| `src/components/Botao.tsx`, `BotaoWhatsApp.tsx` | Botão de 56px (primário, secundário, WhatsApp) |
| `src/components/Passos.tsx`, `Voltar.tsx` | Indicador de passo e link de voltar |

Padrões prontos nos apps (copie quando precisar):
- Abas fixas embaixo: `apps/06-guia/src/components/Abas.tsx`.
- Painel que sobe de baixo (com portal): `apps/06-guia/src/screens/TelaPasseios.tsx`.
- Status simulado com etapas: `apps/07-mesa/src/components/Status.tsx`.
- Ícone escolhido por nome no JSON: `apps/05-festa/src/components/Icone.tsx`.
- Textos em dois idiomas: `apps/06-guia` (`idiomas.json` + campos `{ pt, en }`).

Cores obrigatórias em `marca.json > cores`: `primaria`, `primaria-escura`, `acento`, `acento-claro`, `fundo`, `superficie`, `texto`, `suave`, `borda`, `alerta`. Para uma cor nova, adicione no JSON e em `@theme` no `index.css`.

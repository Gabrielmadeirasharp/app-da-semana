# PROGRESSO · App da Semana

Leia `CLAUDE.md` antes de continuar. Lista de apps e slugs publicados: `apps.json` (marque `"pronto": true` quando o app terminar).

| # | App | Pasta | Link publicado | Status |
|---|---|---|---|---|
| 01 | Simulador de Economia Solar (Jangada Solar) | `apps/01-solar` | `/solar/` | ✅ pronto |
| 02 | Catálogo de Grade para Atacado | `apps/02-atacado` | `/atacado/` | a fazer |
| 03 | Espelho de Vendas | `apps/03-espelho` | `/espelho/` | a fazer |
| 04 | Monte seu Passeio | `apps/04-passeios` | `/passeios/` | a fazer |
| 05 | Orçamento de Festa | `apps/05-festa` | `/festa/` | a fazer |
| 06 | Guia do Hóspede | `apps/06-guia` | `/guia/` | a fazer |
| 07 | Pedido na Mesa | `apps/07-mesa` | `/mesa/` | a fazer |
| 08 | Status do Carro | `apps/08-oficina` | `/oficina/` | a fazer |
| 09 | Banho e Tosa | `apps/09-pet` | `/pet/` | a fazer |
| 10 | Tatame | `apps/10-tatame` | `/tatame/` | a fazer |

Link publicado = `https://<usuario>.github.io/<repo>` + caminho da tabela (depois do primeiro deploy).

## Decisões gerais

- **npm workspaces** na raiz (`apps/*`): um `npm install` serve todos os apps, mas cada app tem o próprio `package.json` e pode ser copiado sozinho para um cliente.
- **Tailwind v4** com cores ligadas a variáveis CSS (`--cor-*`) preenchidas por `marca.json` em tempo de execução. Trocar cor = editar JSON.
- **Slugs curtos** no Pages (`/solar/` em vez de `/01-solar/`), definidos em `apps.json`.
- **Screenshots e conferência da mensagem** automatizados: `npm run screens -- <pasta>` roda o roteiro do vídeo (`apps/<pasta>/docs/roteiro.mjs`) com Playwright em 390 x 844, salva as fotos em `docs/` e a mensagem decodificada em `docs/mensagem-whatsapp.txt`.
- **Número do WhatsApp** ainda é o placeholder `5585999999999` em todos os `marca.json`. Troque pelo número da demonstração antes de mandar os links.
- **GitHub Pages**: workflow em `.github/workflows/pages.yml` (testes + build + deploy a cada push na `main`). O repositório ainda não foi criado no GitHub.

## 01 · Solar

- Marca fictícia **Jangada Solar** (busca não encontrou empresa com esse nome em Fortaleza).
- Teste obrigatório passando: R$ 480 casa → 7 placas, 3,85 kWp, R$ 13.475, parcela 60x R$ 351,03 (< R$ 480).
- Simulação fica só em memória (não há o que guardar entre visitas); `?reset=1` funciona igual pelo template.
- Pendências: validar tarifa (a Enel Ceará teve reajuste em abr/2026), custo por kWp e fio B com uma integradora real.

## Próximo passo exato

Começar o **App 02 · Atacado**: `cp -r template apps/02-atacado`, ajustar `package.json`/`PREFIXO_STORAGE`, pesquisa rápida (Capim Catalog), `SPEC.md`, telas.

# PROGRESSO · App da Semana

Leia `CLAUDE.md` antes de continuar. Lista de apps e slugs publicados: `apps.json` (marque `"pronto": true` quando o app terminar).

| # | App | Pasta | Link publicado | Status |
|---|---|---|---|---|
| 01 | Simulador de Economia Solar (Jangada Solar) | `apps/01-solar` | `/solar/` | ✅ pronto |
| 02 | Catálogo de Grade para Atacado (Lua de Algodão) | `apps/02-atacado` | `/atacado/` | ✅ pronto |
| 03 | Espelho de Vendas (Varanda Nove) | `apps/03-espelho` | `/espelho/` | ✅ pronto |
| 04 | Monte seu Passeio (Rota Duna) | `apps/04-passeios` | `/passeios/` | ✅ pronto |
| 05 | Orçamento de Festa (Bambolê Festas) | `apps/05-festa` | `/festa/` | ✅ pronto |
| 06 | Guia do Hóspede (Pousada Alpendre) | `apps/06-guia` | `/guia/` | ✅ pronto |
| 07 | Pedido na Mesa (Barraca Arrebol) | `apps/07-mesa` | `/mesa/` | ✅ pronto |
| 08 | Status do Carro (Garagem Carnaúba) | `apps/08-oficina` | `/oficina/` | ✅ pronto |
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

## 02 · Atacado

- Marca fictícia **Lua de Algodão** (busca não encontrou confecção com esse nome em Fortaleza).
- Sem fotos de banco: cada peça é um desenho SVG pintado na cor escolhida (troca de cor ao vivo, zero risco de imagem de marca real). Campo `fotos[]` já aceita fotos reais do cliente.
- Faixa de preço conta todas as cores da mesma peça (é como o atacado da José Avelino costuma negociar).
- Botão de enviar só libera depois do pedido mínimo, para a barra ter papel no vídeo.
- Pendências: fotos reais de um cliente; conferir com lojistas se o mínimo é por valor ou por peças (o config suporta valor).

## 03 · Espelho

- Incorporadora fictícia **Varanda Nove**, empreendimento **Vértice Cocó** (busca não encontrou nenhum dos dois em Fortaleza).
- Duas torres (18 e 14 andares, 4 finais) geradas por código; status por semente fixa (mulberry32) dá 53 vendidas, 10 reservadas, 65 disponíveis.
- ID da unidade leva o bloco (`A-1801`) porque com duas torres o número sozinho se repete.
- Simulador: entrada %, 15% do preço em 26 mensais de obra, saldo financiado em 30 anos (Price, 11,5% a.a.).
- Pendências: status real vindo do comercial; trava de reserva.

## 04 · Passeios

- Receptivo fictício **Rota Duna** (busca não encontrou empresa com esse nome).
- Agenda simulada de 14 dias a partir de amanhã, com dias lotados por hash da data (estável) e vagas restantes; a data padrão é o primeiro dia com 6+ vagas para o vídeo não travar.
- Busca no hotel é um switch + zona com taxa; nome do hotel entra na mensagem.
- Barra de ação de todos os apps (e do template) ficou 100% opaca: texto rolando por trás aparecia no vídeo.
- Pendências: agenda real; sinal por Pix.

## 05 · Festa

- Buffet fictício **Bambolê Festas** (busca não encontrou buffet com esse nome em Fortaleza).
- Os três formatos de pacote do Oni viraram três pacotes de exemplo (Essencial = fixo, Festa Completa = faixa, Premium = por pessoa); qualquer buffet se encaixa trocando só o JSON.
- Temas sem imagem de banco: capa gerada com 3 cores + ícone Lucide (zero risco de personagem licenciado).
- Convidados andam de 5 em 5 para o vídeo chegar em 60 com 3 toques; valor "pisca" quando muda.
- Pendências: agenda real; fotos de decoração do cliente.

## 06 · Guia

- Pousada fictícia **Pousada Alpendre** em Jericoacoara. O primeiro nome pensado ("Vento Leste") já existe em Jeri e foi descartado.
- Hóspede vem da URL (`?h=Ana&q=12&saida=...`), PT/EN com `idiomas.json` + campos `{pt, en}` no `dados.json`; teste garante que as duas línguas têm as mesmas chaves.
- Convite de avaliação no Google para todos no último dia (`saida` ou `ultimo=1`), sem filtrar por nota.
- Painel de reserva do passeio usa portal no `<body>`: a animação de troca de tela fazia o `position: fixed` ficar preso dentro da tela.
- PWA offline ficou de fora (dependência extra com risco de compatibilidade com o Vite 8). Restaurantes e coordenadas são fictícios.

## 07 · Mesa

- Barraca fictícia **Barraca Arrebol** (Praia do Futuro; busca não encontrou barraca com esse nome).
- `?demo=1` cria uma rodada inicial para o "Repetir última rodada" ter o que repetir no vídeo.
- Conta por mesa no `localStorage` do celular de quem pede (limitação do protótipo; documentado no README).
- QR codes com a lib `qrcode` (MIT), única dependência extra da série até aqui.
- Status de pedido e de garçom são simulados e marcados como "simulação para demonstração".
- Não reaproveitei código do QR Menu Card (não confirmei a licença); só o padrão de UX.

## 08 · Oficina

- Oficina fictícia **Garagem Carnaúba** (busca não encontrou oficina com esse nome); placa e carro genéricos ("Hatch 1.0").
- "Fotos" dos achados são ilustrações SVG escuras em close; no produto real a oficina sobe a foto.
- Item sem decisão vai como "recusado" na mensagem, para o vídeo não precisar de 4 toques extras.
- `?demo=1` mostra um botão discreto (portal, canto superior direito) que avança as etapas.
- Pendências: painel da oficina; histórico por placa.

## Próximo passo exato

Começar o **App 09 · Banho e Tosa**: `cp -r template apps/09-pet`, ajustar `package.json`/`PREFIXO_STORAGE`, `npm install` na raiz, pesquisa rápida (MoeGo report card), `SPEC.md`, telas. Atenção: modal/painel fixo deve usar portal (ver 06); com abas embaixo, não usar `BarraAcao` sticky (ver 07).

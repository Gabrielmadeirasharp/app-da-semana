# Missão: construir os mini apps da série "App da Semana"

Você vai construir protótipos de mini apps para uma série de Reels chamada **App da Semana**. Cada app resolve uma dor concreta de um nicho de negócio local (foco em Fortaleza, CE) e será gravado na tela do celular para mostrar a donos de negócio como ele funciona. Quem pede o link nos comentários recebe o protótipo para testar.

**Ordem de trabalho:** construa o **App 01 completo** (funcionando, testado, documentado, com commit). Só depois comece o App 02, e assim por diante, enquanto houver contexto e tokens. Nunca deixe dois apps pela metade.

O dono do projeto é o Gabriel, gestor de tráfego e sócio de uma agência de marketing. Ele está começando em programação: escreva código simples, organizado e com comentários curtos em português nos pontos que ele vai querer mexer.

---

## 1. Regras de ouro (não negociáveis)

1. **Replicável vale mais que perfeito.** Segurança, autenticação e banco de dados não importam agora. O que importa é que as **features e o funcionamento** possam ser replicados para qualquer cliente do mesmo nicho trocando só configuração.
2. **Tudo que muda de cliente para cliente fica em JSON.** Nome da marca, cores, logo, fontes, número de WhatsApp, produtos, preços, horários, textos de mensagem e parâmetros de cálculo ficam em `src/config/`. Trocar de cliente = editar JSON, sem tocar em componente.
3. **Dados "mock first".** Toda leitura de dados passa por uma camada única (`src/data/repository.ts`) que hoje lê dos JSON locais. Deixe a interface pronta para, no futuro, trocar por Supabase ou Google Sheets sem mexer nas telas. Persistência só em `localStorage` e só onde fizer sentido (carrinho, check ins, conta da mesa).
4. **Mobile first.** Projetado para 390 x 844. No máximo 4 telas principais. Sem login, sem pagamento.
5. **Toda jornada termina no WhatsApp.** A ação final abre `https://wa.me/<numero>?text=<mensagem>` com a mensagem montada a partir de um template do config (`encodeURIComponent`). A mensagem precisa chegar organizada, legível e com todos os dados escolhidos.
6. **Marca fictícia, cara de Fortaleza.** Cada app usa um negócio inventado (faça uma busca rápida para confirmar que o nome não é de empresa conhecida em Fortaleza). Use bairros, praias e preços plausíveis da cidade. **Nunca** use nome, logo, foto ou layout idêntico de empresa real. Nada de personagens licenciados.
7. **Valores ilustrativos.** Exiba um rodapé discreto: "Protótipo demonstrativo · valores ilustrativos".
8. **Português do Brasil.** Moeda com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`, datas em pt-BR, textos naturais e diretos, sem frases prontas de marketing.
9. **Visual sem cara de IA.** Proibido: gradiente roxo genérico, glassmorphism por padrão, emoji no lugar de ícone, cards todos iguais com sombra gigante. Cada app tem identidade própria coerente com o nicho (paleta, tipografia do Google Fonts com personalidade, ícones `lucide-react`). Antes de desenhar, olhe como apps reais do segmento resolvem a mesma tela. Se a skill `frontend-design` estiver disponível, use.
10. **Feito para gravar.** A tela vai ser gravada no celular, então: fonte mínima de 16px no corpo, alvos de toque grandes, transições suaves de 200 a 300ms, nada de layout pulando, primeira tela bonita (ela é a capa do vídeo). Toda app aceita `?reset=1` para limpar o `localStorage` e voltar ao estado inicial antes de gravar de novo.

---

## 2. Stack e estrutura

- **Vite + React + TypeScript + Tailwind CSS + lucide-react.** Sem backend.
- Navegação entre telas com estado simples ou `react-router` com hash (`#/tela`), para funcionar em hospedagem estática.
- `vite.config.ts` com `base: './'` para rodar em qualquer subpasta (GitHub Pages, Vercel, Netlify).
- Gráficos simples em SVG próprio, sem biblioteca pesada.
- Funções de cálculo **puras**, em `src/lib/`, com testes em **Vitest**.
- Imagens: fotos de banco com licença livre (Unsplash, Pexels) baixadas para `public/img/` com crédito no README, ou ilustrações SVG simples. Nunca foto de marca real.

```
mini-apps/
├── CLAUDE.md                 # regras de ouro resumidas (crie no início)
├── PROGRESSO.md              # status de cada app (atualize a cada app)
├── PROMPT_APP_DA_SEMANA.md   # este arquivo
├── index.html                # galeria com link para cada app pronto
├── template/                 # base criada durante o App 01
└── apps/
    ├── 01-solar/
    │   ├── SPEC.md
    │   ├── README.md
    │   ├── docs/             # screenshots das telas
    │   └── src/
    │       ├── config/       # marca.json, dados.json, calculo.json, mensagens.json
    │       ├── data/repository.ts
    │       ├── lib/          # cálculos puros + testes
    │       ├── screens/
    │       └── components/
    ├── 02-atacado/
    └── ...
```

Cada app é **independente** (próprio `package.json`), para poder ser entregue e publicado separado para um cliente. Durante o App 01, extraia o que é comum (tema a partir do config, botão de WhatsApp, formatação de moeda, rodapé, shell de telas, `?reset=1`) para `template/`. Os próximos apps começam copiando `template/`.

**Publicação:** crie um workflow de GitHub Actions que builda todos os apps prontos e publica no GitHub Pages em `/<slug>/`, com o `index.html` da raiz listando os apps. Se o repositório ainda não estiver no GitHub, deixe tudo pronto e me passe os comandos exatos para subir. O Gabriel precisa de um **link público por app** para mandar no direct.

**WhatsApp:** cada `marca.json` tem `"whatsapp": "5585999999999"` como placeholder. Antes do primeiro deploy, pergunte ao Gabriel qual número usar na demonstração.

---

## 3. Fluxo de trabalho por app (repita para cada um)

1. **Pesquisa rápida (3 a 5 buscas).** Confirme as referências listadas na especificação e procure repositórios open source com o mesmo fluxo. Pode reaproveitar código **apenas** de licença permissiva (MIT, Apache 2.0, BSD), citando no README. Copie o **padrão de UX** e a **lógica**, nunca textos, imagens, marca ou layout idêntico de produto comercial.
2. **`SPEC.md` curto** (até 20 linhas): telas, modelo de dados, regras de cálculo, template da mensagem.
3. **Implementação** seguindo as regras de ouro.
4. **Validação:**
   - `npm run build` sem erro e sem warning de TypeScript.
   - Testes Vitest das funções de cálculo passando, incluindo o caso usado no vídeo.
   - Rode o app e verifique cada tela em 390 x 844 (use Playwright se disponível) e salve screenshots em `docs/`.
   - Gere a mensagem de WhatsApp do fluxo do vídeo e confira o texto decodificado.
   - Percorra o **critério de aceite** do app do início ao fim.
5. **`README.md` do app:** o que faz, como rodar, **como adaptar para um cliente** (quais JSON editar e o que cada campo faz), o que falta para virar produto real, referências e créditos.
6. **Commit:** `feat(<slug>): protótipo completo`.
7. **Atualize `PROGRESSO.md`:** status, link publicado, decisões tomadas e pendências.
8. Só então passe para o próximo app.

## 4. Gestão de contexto e tokens

- Um app por vez, do começo ao fim.
- Se perceber que o contexto ou o limite está acabando, **pare num ponto limpo**: commit, `PROGRESSO.md` atualizado com o "próximo passo exato".
- Ao começar uma nova sessão, leia `CLAUDE.md` e `PROGRESSO.md` antes de qualquer coisa.
- Se faltar fôlego dentro de um app, a prioridade é: fluxo principal funcionando > mensagem de WhatsApp > visual > testes > extras.

---

## 5. Especificação dos apps (em ordem de execução)

Cada especificação traz: objetivo, referências consolidadas para copiar o padrão, telas, regras, campos de config, template de mensagem, o que fica fora e o **critério de aceite**, que é exatamente o fluxo que será gravado no vídeo.

---

### App 01 · Simulador de Economia Solar (`01-solar`) · palavra SOL

**Objetivo:** o visitante digita quanto paga de luz e descobre sozinho a economia, o tamanho do sistema e que a parcela do financiamento cabe no lugar da conta. Cliente: integradoras de energia solar.

**Referências para copiar o padrão:**
- Calculadoras de energia solar com fórmula aberta (ex.: ValorFinal), baseadas em Atlas Solar/INPE e CRESESB: geração por kWp = HSP × 30 × 0,8; potência = consumo ÷ geração por kWp; custo = potência × custo por kWp; payback = custo ÷ economia mensal.
- Lógica de custo x economia da Google Solar API (consumo a partir da conta, perdas de conversão, energia que ainda vem da distribuidora).
- Simuladores de integradoras brasileiras: entrada só com o valor da conta em reais, resultado imediato, CTA de proposta.

**Telas:**
1. **Sua conta:** valor médio da conta (campo grande com slider de R$ 150 a R$ 3.000), tipo de imóvel (casa ou comércio), bairro (lista de bairros de Fortaleza e Região Metropolitana).
2. **Resultado:** economia por mês e em 10 anos, quantidade de placas, potência em kWp, tempo de retorno, gráfico de barras "conta hoje x conta com solar".
3. **Parcela x conta:** parcela do financiamento lado a lado com a conta atual, chips de prazo (36, 48, 60, 72 meses). Se a parcela ficar menor que a conta, destaque isso.
4. **Quero minha proposta:** nome e um toque para abrir o WhatsApp com tudo preenchido.

**Cálculo (`src/lib/solar.ts`, todos os parâmetros em `calculo.json`):**
```
consumo_kwh        = conta / tarifa_kwh
disponibilidade    = casa: 50 kWh (bifásico) | comércio: 100 kWh (trifásico)
compensavel_kwh    = max(0, consumo_kwh - disponibilidade)
geracao_por_kwp    = hsp * 30 * fator_perdas
placas             = ceil( (compensavel_kwh / geracao_por_kwp) / potencia_painel_kwp )
kwp                = placas * potencia_painel_kwp
investimento       = kwp * custo_por_kwp
economia_mensal    = conta - (disponibilidade * tarifa_kwh) - (compensavel_kwh * tarifa_kwh * desconto_fio_b)
payback_anos       = investimento / (economia_mensal * 12)
economia_10_anos   = soma de 10 anos com reajuste_anual sobre a economia
parcela            = investimento * i / (1 - (1 + i)^-n)    (tabela Price)
```
Valores padrão ilustrativos: `tarifa_kwh 0.95`, `hsp 5.6`, `fator_perdas 0.8`, `potencia_painel_kwp 0.55`, `custo_por_kwp 3500`, `desconto_fio_b 0.15`, `reajuste_anual 0.05`, `taxa_mensal 0.016`. Deixe no README que esses números precisam ser validados com a integradora cliente (tarifa da distribuidora e regras da Lei 14.300 mudam).

**Teste obrigatório:** conta de R$ 480 em casa deve gerar cerca de 7 placas (3,85 kWp), investimento perto de R$ 13,5 mil e parcela em 60x abaixo de R$ 480.

**Mensagem:** "Olá! Fiz a simulação no site. Conta média de {conta}, {tipo} no bairro {bairro}. Resultado: {placas} placas ({kwp} kWp), economia estimada de {economia}/mês e parcela de {parcela} em {n}x. Quero receber uma proposta. {nome}"

**Fora do protótipo:** cálculo por endereço e sombreamento, tarifa automática da distribuidora, CRM.

**Critério de aceite (vídeo):** digita R$ 480 → vê a economia → desliza até a parcela menor que a conta → toca em "Quero minha proposta" → WhatsApp abre com a mensagem completa.

---

### App 02 · Catálogo de Grade para Atacado (`02-atacado`) · palavra GRADE

**Objetivo:** a revendedora monta a grade por cor e tamanho, vê se bateu o pedido mínimo e manda o pedido organizado para o lojista. Cliente: lojistas do Polo de Moda da José Avelino e confecções que vendem no atacado.

**Referências para copiar o padrão:**
- **Capim Catalog** (GitHub `marciodiasdeveloper/capim-catalog`, MIT): catálogo brasileiro com preço de atacado por faixa de quantidade calculado em tempo real, checkout por `wa.me` e camada de dados "mock first" com backend opcional. Estude a lógica de preço e a montagem da mensagem.
- Plugins de pedido por WhatsApp para WooCommerce (ex.: ZapOrder) e módulos de atacado: pedido mínimo por valor e por quantidade, variações de tamanho e cor na mensagem, "modo catálogo".
- Boa prática de catálogo de atacado: deixar claro unidade de venda, pedido mínimo e prazo de separação.

**Telas:**
1. **Coleção:** grade de produtos com foto, preço de atacado, selo de grade mínima, filtro por categoria.
2. **Montar grade:** chips de cor, stepper por tamanho (P, M, G, GG), botão "+1 grade completa", subtotal e preço por faixa quando a quantidade atingir o próximo degrau.
3. **Carrinho:** itens agrupados por peça e cor, edição rápida, **barra de progresso do pedido mínimo** ("faltam R$ 230 para o mínimo").
4. **Enviar pedido:** nome, cidade/UF e forma de envio (excursão/ônibus, transportadora, retirada no box).

**Dados (`dados.json`):** produtos com `id, nome, categoria, fotos[], cores[{nome, hex}], tamanhos[], preco_atacado, faixas[{min_pecas, preco}], grade_minima`. Loja com `pedido_minimo_valor`, `formas_envio[]`, `prazo_separacao`.

**Mensagem (formatada para WhatsApp, com *negrito*):**
```
*Pedido de atacado*
Cliente: {nome} · {cidade}/{uf}
Envio: {envio}

*Blusa Ana* · Azul: P2 M2 G2 GG1 (7 pç) · R$ 245,00
...
Total: {pecas} peças · {total}
```

**Fora do protótipo:** estoque real, pagamento, painel do lojista.

**Critério de aceite (vídeo):** escolhe a peça → monta a grade → a barra do mínimo enche → envia → o pedido chega limpo no WhatsApp.

---

### App 03 · Espelho de Vendas (`03-espelho`) · palavra ESPELHO

**Objetivo:** o corretor vê no celular o que está disponível em um lançamento, simula a parcela e reserva com o comercial. Cliente: construtoras, incorporadoras e imobiliárias de lançamento.

**Referências para copiar o padrão:**
- Espelho de vendas do **Vimob** e do **Hypnobox** (documentação pública da Senior): status de unidade com cores configuráveis, visão em grade ou em cards, navegação por bloco, filtros por área e fase da obra, reserva iniciada a partir do espelho.
- Espelhos interativos de mercado: cada unidade com link próprio para o corretor mandar direto ao comprador; mesma interface no site e na tela do plantão.

**Telas:**
1. **Empreendimento:** foto, bairro, percentual da obra, previsão de entrega, tipologias e contadores ("18 disponíveis").
2. **Espelho:** grade andares x finais, por bloco, cores por status (disponível, reservada, vendida), legenda e filtros (tipologia, só disponíveis).
3. **Unidade:** metragem, posição do sol, vagas, preço e simulador (entrada em %, mensais durante a obra, saldo financiado com parcela estimada). Botão "copiar link desta unidade" (`#/unidade/1402`).
4. **Reservar:** nome do corretor, nome do cliente → WhatsApp do comercial.

**Dados:** gere as unidades por código a partir de `blocos[{nome, andares, finais}]` e tipologias, com status distribuídos por semente fixa (sempre o mesmo resultado, ~40% vendidas). Status em config: `{id, rotulo, cor}`. Parâmetros do simulador em `calculo.json` (entrada mínima, meses até a entrega, taxa anual do financiamento, prazo).

**Mensagem:** "Reserva: {empreendimento}, unidade {unidade} (bloco {bloco}, {area} m², {tipologia}). Simulação: entrada {entrada}, {n} mensais de {mensal} até a entrega, saldo {saldo}. Corretor: {corretor}. Cliente: {cliente}."

**Fora do protótipo:** atualização em tempo real pelo time comercial, login de corretor, integração com CRM.

**Critério de aceite (vídeo):** abre o espelho → toca numa unidade verde → ajusta a entrada → toca em "Reservar" → WhatsApp abre com unidade e simulação.

---

### App 04 · Monte seu Passeio (`04-passeios`) · palavra PASSEIO

**Objetivo:** o turista escolhe destino, data e quantas pessoas, e vê o preço fechado antes de chamar. Cliente: agências de receptivo e bugueiros.

**Referências para copiar o padrão:**
- **FareHarbor** (padrão consolidado de reserva de passeios): passeio → disponibilidade por horário com vagas → tarifas por tipo de cliente (adulto, criança) → validação do preço → reserva; locais de busca (hotel) com elegibilidade por horário; extras.

**Telas:**
1. **Destino:** cards de Cumbuco, Canoa Quebrada, Morro Branco, Lagoinha e Jericoacoara, com duração e horário de saída.
2. **Configurar:** data (alguns dias aparecem lotados, simulado), adultos e crianças, buggy privativo ou passeio compartilhado, zona de busca no hotel, extras.
3. **Resumo:** valor por pessoa e total, o que está incluído, horário e ponto de saída.
4. **Reservar:** nome e WhatsApp.

**Cálculo:** privativo = `ceil(pessoas / capacidade_buggy) × preco_por_buggy`; compartilhado = `adultos × preco_adulto + criancas × preco_crianca`; somar extras (por pessoa ou por grupo) e taxa da zona de busca.

**Dados:** destinos com modalidades, extras, dias de operação; zonas de busca com taxa (ex.: Meireles/Iracema 0, Praia do Futuro 30).

**Mensagem:** "Quero reservar: {destino} em {data}, {adultos} adultos e {criancas} crianças, {modalidade}, busca em {zona}. Extras: {extras}. Total estimado: {total}. {nome}"

**Fora do protótipo:** agenda real de carros, sinal por Pix, voucher.

**Critério de aceite (vídeo):** escolhe Cumbuco → 4 pessoas → marca busca no hotel → o total aparece → "Reservar".

---

### App 05 · Orçamento de Festa (`05-festa`) · palavra FESTA

**Objetivo:** a cliente monta a festa, escolhe pacote, tema e extras, e vê o valor estimado na hora. Cliente: buffets infantis, decoradoras, festa pegue e monte, animação.

**Referências para copiar o padrão:**
- Software de gestão de buffet **Oni** (central de ajuda pública): três tipos de pacote que cobrem o mercado: **valor por pessoa** (com excedente e meia para crianças), **valor fixo por faixa de convidados** (até 50, 60, 70, 80) e **valor fixo**. Modele o config com esses três tipos para servir qualquer buffet.
- Padrão de configurador com resumo de preço sempre visível (estilo checkout de passeios e montadores de produto).

**Telas:**
1. **Sua festa:** tipo (infantil, 15 anos, adulto, chá revelação), data, adultos e crianças.
2. **Pacote e tema:** três pacotes fictícios com o que incluem; cards de tema com imagens genéricas (**sem personagem licenciado**).
3. **Extras:** animação, lembrancinhas, bolo, fotografia e filmagem, cada um com valor fixo ou por convidado.
4. **Resumo:** valor estimado, itens, aviso se a data está "concorrida" (lista mock de datas cheias) e botão "Ver se a data está livre".

**Mensagem:** "Quero um orçamento: {tipo} em {data}, {adultos} adultos e {criancas} crianças. Pacote {pacote}, tema {tema}. Extras: {extras}. Valor estimado: {total}. A data está livre?"

**Fora do protótipo:** agenda real, contrato, sinal.

**Critério de aceite (vídeo):** 60 convidados → pacote do meio → marca animação e fotografia → valor atualiza → "Ver se a data está livre".

---

### App 06 · Guia do Hóspede (`06-guia`) · palavra GUIA

**Objetivo:** a pousada manda um link no check in com tudo que o hóspede pergunta, mais passeios para reservar. Cliente: pousadas de 10 a 40 quartos em Jericoacoara, Canoa, Cumbuco, Taíba.

**Referências para copiar o padrão:**
- **Touch Stay** e **Hostfully** (guias digitais consolidados): link sem instalar app, funciona offline, marca própria (logo, fonte, cores, fotos), recomendações locais com mapa, venda de serviços extras dentro do guia, vários idiomas, versão para imprimir.

**Telas:**
1. **Boas vindas:** nome do hóspede e quarto vindos da URL (`?h=Ana&q=12`, personalização sem banco), atalhos para o que mais se pergunta.
2. **A casa:** senha da internet com botão copiar (feedback visual), café, check in e check out, regras, contatos.
3. **Passeios e indicações:** passeios com preço para reservar pela recepção, restaurantes e lugares indicados com link para o mapa.
4. **Pedidos:** toalha extra, saída mais tarde, transfer; no último dia, convite para avaliar no Google (link do config, pedido igual para todos os hóspedes, sem filtrar quem avalia).

**Extras:** alternância PT/EN com textos em JSON de idiomas. Se for simples, PWA com cache offline (`vite-plugin-pwa`).

**Mensagem:** "Olá, recepção! Sou {nome}, quarto {quarto}. Quero {pedido_ou_passeio} {detalhes}."

**Fora do protótipo:** integração com sistema de reservas, envio automático do link, comissão de passeios.

**Critério de aceite (vídeo):** abre o guia → copia a senha → vê o horário do café → entra em passeios → reserva o pôr do sol.

---

### App 07 · Pedido na Mesa (`07-mesa`) · palavra MESA

**Objetivo:** o cliente pede pelo QR da mesa, repete a rodada com um toque, chama o garçom e divide a conta. Cliente: barracas da Praia do Futuro, beach clubs, restaurantes de praia.

**Referências para copiar o padrão:**
- **QR Menu Card** (GitHub `CodecraftBySyed/QR-Menu-Card`): cardápio estático, mesa detectada pela URL, carrinho em `localStorage`, checkout por `wa.me`, recurso ligado por flag, gerador de QR. Verifique a licença antes de reaproveitar código.
- Plataformas de pedido na mesa (ex.: Fleksa): QR único por mesa com número embutido, botão de chamar garçom com motivo, repetir rodada com um toque, dividir conta igualmente ou por item.

**Telas:**
1. **Cardápio da mesa:** cabeçalho "Mesa 12" vindo de `?mesa=12`, categorias e fotos.
2. **Pedido:** carrinho e botão **"Repetir última rodada"** (refaz o último pedido de bebidas). Pedido enviado ao WhatsApp da barraca com o número da mesa; status "recebido → preparando" simulado com marcação de demo.
3. **Chamar garçom:** gelo, guardanapo, cardápio, conta ou outro, com status "a caminho" simulado.
4. **Conta:** consumo acumulado da mesa (`localStorage`), dividir igual por N pessoas ou por item.

**Extra que ajuda a vender:** rota `#/qr` que gera e imprime os QR codes de todas as mesas.

**Mensagem:** "*Mesa {mesa}*\n{itens}\nTotal do pedido: {total}" e, para garçom, "*Mesa {mesa}* pediu: {motivo}".

**Fora do protótipo:** integração com caixa e cozinha, pagamento na mesa.

**Critério de aceite (vídeo):** abre `?mesa=4` → "Repetir última rodada" → chama o garçom pedindo gelo → conta dividida por 4.

---

### App 08 · Status do Carro (`08-oficina`) · palavra OFICINA

**Objetivo:** o dono do carro acompanha o serviço por um link, vê as fotos do problema e aprova item por item. Cliente: oficinas, funilarias, estética automotiva.

**Referências para copiar o padrão:**
- **Inspeção Veicular Digital (DVI)**, padrão consolidado em Tekmetric, AutoLeap, Kimoby e na rede Christian Brothers: link enviado por mensagem, linha do tempo de status, achados classificados em verde, amarelo e vermelho com foto e nota, aprovação ou recusa **linha a linha** pelo celular, histórico do veículo.

**Telas:**
1. **Seu carro:** modelo, placa fictícia e linha do tempo (recebido, diagnóstico, aguardando aprovação, em serviço, pronto). OS escolhida por `?os=1234`.
2. **Inspeção e orçamento:** achados agrupados por cor, foto ampliável, peça + mão de obra, aprovar ou recusar cada item, total aprovado. Ao aprovar, a linha do tempo avança.
3. **Pronto:** horário de retirada e valor final.
4. **Avaliação:** convite para avaliar no Google (link do config) feito para **todos** os clientes. Não filtre por nota (o Google proíbe pedir avaliação só a quem gostou).

**Demo:** com `?demo=1`, um controle discreto avança as etapas para a gravação.

**Mensagem:** "OS {os} · {carro} ({placa}). Aprovo: {itens_aprovados}. Recuso: {itens_recusados}. Total aprovado: {total}."

**Fora do protótipo:** painel da oficina para atualizar status, envio automático do link.

**Critério de aceite (vídeo):** abre o link → etapa "aguardando aprovação" → olha a foto → aprova dois itens → a linha do tempo avança.

---

### App 09 · Banho e Tosa (`09-pet`) · palavra BANHO

**Objetivo:** o tutor agenda, recebe a foto do pet pronto e acompanha o pacote mensal. Cliente: pet shops, clínicas com estética, banho com busca.

**Referências para copiar o padrão:**
- **MoeGo** (grooming report card com fotos, enviado por link), **Groomer.io** e **DaySmart Pet** (aviso automático de "pronto para buscar"), **Time To Pet** (report card pós-visita), pacotes recorrentes.

**Telas:**
1. **Agendar:** escolhe o pet (cadastro mock com foto, raça, porte, observações), serviço com preço por porte, horário livre.
2. **No banho:** linha do tempo (chegou, banho, secagem, tosa, pronto). Em "pronto", aparece o report card com foto, nota da tosadora e produtos usados, e o botão "Estou indo buscar".
3. **Pacote:** 4 banhos por mês com contador de usados e renovação.
4. **Próximo banho:** sugestão de data pela frequência, remarcar pelo WhatsApp.

**Mensagem:** "Agendamento: {pet} ({porte}), {servico} em {data} às {hora}." / "Estou indo buscar o {pet}!"

**Fora do protótipo:** agenda da equipe, cobrança recorrente, ficha de saúde.

**Critério de aceite (vídeo):** agenda o banho → tela "no banho" → chega a foto do pet pronto → mostra o contador do pacote.

---

### App 10 · Tatame (`10-tatame`) · palavra OSS

**Objetivo:** o aluno faz check in, vê quanto falta para o próximo grau e o professor vê quem está pronto e quem sumiu. Cliente: academias de jiu jitsu, muay thai e judô.

**Referências para copiar o padrão:**
- **House of Grapplers**, **Gymdesk**, **MyStudio** e **Clubworx**: check in por QR ou quiosque, faixa e graus com critério (presenças desde o último grau e tempo na faixa), prontidão para graduar, alerta de aluno em risco, aluno vendo a própria evolução.

**Telas:** alternância Aluno / Professor no topo (sem login).
1. **Check in:** leitura do QR do tatame (para a demo, botão "simular leitura") com animação de confirmação.
2. **Meu tatame:** faixa desenhada em SVG com os graus, barra até o próximo grau, mapa de presenças do mês.
3. **Painel do professor:** prontos para graduar, alunos sem treinar há 14 dias ou mais com botão de mensagem, filtros por faixa.
4. **Mensalidade:** situação do aluno e lembrete educado pelo WhatsApp.

**Config:** faixas e cores, aulas por grau (padrão 30, configurável, porque cada academia tem seu critério), dias para considerar aluno sumido, textos das mensagens.

**Mensagem:** "Fala, {aluno}! Sentimos sua falta no tatame. Bora voltar essa semana?" (texto editável no config).

**Fora do protótipo:** cobrança automática, várias turmas e horários, app instalável.

**Critério de aceite (vídeo):** check in pelo QR → tela do aluno com a barra até o próximo grau → painel do professor com o alerta de aluno sumido.

---

## 6. Primeiro passo agora

1. Crie a estrutura do repositório, o `CLAUDE.md` com as regras de ouro resumidas e um `PROGRESSO.md` com os 10 apps listados como "a fazer".
2. Faça a pesquisa rápida do App 01 e comece.
3. Ao terminar cada app, me mostre: screenshots, a mensagem de WhatsApp gerada no fluxo do vídeo e o comando para rodar localmente.

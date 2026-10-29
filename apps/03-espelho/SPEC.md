# SPEC · 03-espelho · Espelho de Vendas (Varanda Nove / Vértice Cocó)

**Telas (hash):** `#/` Empreendimento · `#/espelho` Espelho · `#/unidade/<bloco>-<numero>` Unidade · `#/reservar/<id>` Reservar.

**Modelo de dados:** unidades geradas por código a partir de `blocos[{id, nome, andares, finais}]` × `tipologias[{id, rotulo, area, suites, vagas, finais, preco_m2}]`.
`Unidade { id, numero, bloco, andar, final, tipologia, sol, preco, status }`. Status `{id, rotulo, cor}` no config, sorteado com semente fixa (~40% vendidas, ~10% reservadas).
Nome do corretor salvo no `localStorage` (`espelho:corretor`).

**Regras (`src/lib/espelho.ts`):**
- preço = área × preço/m² × (1 + acréscimo por andar × (andar − 1)), arredondado a R$ 1.000.
- entrada = preço × % (slider de 10% a 50%) · mensais = preço × % da obra ÷ meses até a entrega.
- saldo = preço − entrada − total das mensais · parcela estimada = Price com taxa anual convertida para mensal.

**Mensagem:** "Reserva: {empreendimento}, unidade {unidade} (bloco {bloco}, {area} m², {tipologia}). Simulação: entrada {entrada}, {n} mensais de {mensal} até a entrega, saldo {saldo}. Corretor: {corretor}. Cliente: {cliente}."

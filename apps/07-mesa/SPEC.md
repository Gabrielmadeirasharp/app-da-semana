# SPEC · 07-mesa · Pedido na Mesa (Barraca Arrebol, Praia do Futuro)

**Telas (abas, hash):** `#/` Cardápio · `#/pedido` Pedido · `#/garcom` Chamar garçom · `#/conta` Conta. Extra: `#/qr` (imprimir QR das mesas).

**Modelo de dados:** mesa por `?mesa=N`. `ItemCardapio { id, nome, preco, categoria, icone, cor, bebida? }`.
`localStorage` por mesa: `mesa:carrinho:N` (linhas `{id, qtd}`) e `mesa:conta:N` (rodadas `{hora, itens[]}`). `?demo=1` cria uma rodada inicial.

**Regras (`src/lib/mesa.ts`):**
- Repetir última rodada = itens com `bebida: true` do último pedido, somados ao carrinho.
- Ao enviar, o carrinho vira uma rodada na conta da mesa; status simulado recebido → preparando → a caminho.
- Conta = soma das rodadas + serviço (10%); dividir igual por N (centavos que sobram ficam com uma pessoa) ou por item marcado.

**Caso do vídeo:** rodada demo (3 cervejas, 1 água de coco, isca, 4 caranguejos) + repetição das bebidas = R$ 232 + 10% = R$ 255,20 → 4 × R$ 63,80.

**Mensagens:** "*Mesa {mesa}*\n{itens}\nTotal do pedido: {total}" e "*Mesa {mesa}* pediu: {motivo}".

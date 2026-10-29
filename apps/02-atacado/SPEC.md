# SPEC · 02-atacado · Catálogo de Grade para Atacado (Lua de Algodão)

**Telas (hash):** `#/` Coleção · `#/produto/<id>` Montar grade · `#/carrinho` Carrinho · `#/enviar` Enviar pedido.

**Modelo de dados:** `Produto { id, nome, categoria, modelo, fotos[], cores[{nome,hex}], tamanhos[], preco_atacado, faixas[{min_pecas,preco}], grade_minima }`.
Loja: `pedido_minimo_valor`, `formas_envio[]`, `prazo_separacao`. Carrinho `carrinho[produto][cor][tamanho] = qtd` no `localStorage` (`atacado:carrinho`).

**Regras (`src/lib/atacado.ts`):**
- Preço por peça = maior faixa com `min_pecas <= peças do produto` (somando todas as cores), senão `preco_atacado`.
- Próxima faixa: "Mais N pç e o preço cai para R$ X".
- "+1 grade completa" soma 1 em cada tamanho da cor escolhida.
- Pedido mínimo por valor: barra de progresso; botão "Continuar" só libera ao atingir.

**Mensagem (WhatsApp, `*negrito*`):**
```
*Pedido de atacado · {loja}*
Cliente: {nome} · {cidade}/{uf}
Envio: {envio}

*Blusa Ana* · Azul: P2 M2 G2 GG2 (8 pç) · R$ 280,00
Total: {pecas} peças · {total}
```

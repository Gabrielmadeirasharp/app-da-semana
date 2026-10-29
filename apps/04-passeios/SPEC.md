# SPEC · 04-passeios · Monte seu Passeio (Rota Duna)

**Telas (hash):** `#/` Destino · `#/configurar/<destino>` Configurar · `#/resumo` Resumo · `#/reservar` Reservar.

**Modelo de dados:** `Destino { id, nome, km, duracao, saida, retorno, paisagem, dias_operacao[], vagas_por_dia, compartilhado{preco_adulto, preco_crianca}, privativo{preco_por_buggy, capacidade_buggy}, inclui[] }`, `extras[{id, rotulo, preco, tipo: pessoa|grupo}]`, `zonas_busca[{id, rotulo, taxa}]`.
Reserva em memória: `{ destino, data, adultos, criancas, modalidade, extras[], buscar, zona }`.

**Cálculo (`src/lib/passeios.ts`):**
- privativo = `ceil(pessoas / capacidade_buggy) × preco_por_buggy`
- compartilhado = `adultos × preco_adulto + criancas × preco_crianca`
- + extras (por pessoa × pessoas, ou por grupo) + taxa da zona de busca (se marcar busca no hotel)
- por pessoa = total ÷ pessoas
- Agenda: próximos N dias; dias fora de `dias_operacao` sem saída; ~20% lotados por hash da data (determinístico). Bloqueia "Ver resumo" se o grupo for maior que as vagas.

**Caso do vídeo:** Cumbuco, 4 adultos, compartilhado, busca na Praia do Futuro (+R$ 30) = R$ 390 (R$ 610 com almoço).

**Mensagem:** "Quero reservar: {destino} em {data}, {adultos} adultos e {criancas} crianças, {modalidade}, busca em {zona}. Extras: {extras}. Total estimado: {total}. {nome}"

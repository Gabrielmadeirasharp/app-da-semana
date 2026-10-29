# SPEC · 06-guia · Guia do Hóspede (Pousada Alpendre, Jericoacoara)

**Telas (abas, hash):** `#/` Boas-vindas · `#/casa` A casa · `#/passeios` Passeios e indicações · `#/pedidos` Pedidos. Alternância PT/EN no topo.

**Modelo de dados:** hóspede da URL `?h=Ana&q=12[&saida=AAAA-MM-DD|&ultimo=1][&lang=en]` → `{ nome, quarto, ultimoDia }`.
Conteúdo em `dados.json` com textos `{ pt, en }`; interface em `idiomas.json`. Idioma salvo no `localStorage` (`guia:idioma`).

**Regras (`src/lib/guia.ts`):**
- `lerHospede()` lê a URL; último dia = `saida <= hoje` ou `ultimo=1`.
- `t(texto, idioma)` escolhe a tradução (cai no PT).
- Convite de avaliação no Google aparece para todo hóspede no último dia (sem filtro de nota).
- Passeio: painel com pessoas e dia (hoje/amanhã) → WhatsApp da recepção.

**Mensagem:** "Olá, recepção! Sou {nome}, quarto {quarto}. Quero {pedido_ou_passeio} {detalhes}." (versão EN no mesmo JSON)
Ex.: "Olá, recepção! Sou Ana, quarto 12. Quero reservar o passeio Pôr do sol na duna para 2 pessoa(s), hoje."

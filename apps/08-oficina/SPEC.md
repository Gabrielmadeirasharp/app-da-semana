# SPEC · 08-oficina · Status do Carro (Garagem Carnaúba)

**Telas (hash):** `#/` Seu carro (linha do tempo) · `#/inspecao` Inspeção e orçamento · `#/pronto` Pronto · `#/avaliar` Avaliação. OS por `?os=1234`; `?demo=1` mostra o botão que avança etapas.

**Modelo de dados:** `Ordem { os, cliente, carro, placa, km, entrada, etapa_inicial, previsao_pronto, achados[] }`, `Achado { id, titulo, cor: vermelho|amarelo|verde, nota, foto, peca, mao_obra }`.
Andamento no `localStorage` por OS (`oficina:os:1234`): `{ etapa, decisoes{id: aprovado|recusado}, aprovacaoEnviada }`.

**Regras (`src/lib/oficina.ts`):**
- Pedem decisão só os achados não verdes com valor > 0. Valor = peça + mão de obra.
- Total aprovado = soma dos aprovados. Item sem decisão vai como recusado ao enviar.
- Enviar aprovação → WhatsApp + etapa passa para "Em serviço" (linha do tempo avança).
- Avaliação no Google para todos, sem filtro de nota.

**Caso do vídeo:** aprova pastilhas (R$ 279) e óleo (R$ 208) = R$ 487.

**Mensagem:** "OS {os} · {carro} ({placa}). Aprovo: {itens_aprovados}. Recuso: {itens_recusados}. Total aprovado: {total}."

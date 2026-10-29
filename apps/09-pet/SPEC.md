# SPEC · 09-pet · Banho e Tosa (Pata de Areia)

**Telas (abas, hash):** `#/` Agendar · `#/banho` No banho · `#/pacote` Pacote · `#/proximo` Próximo banho.

**Modelo de dados:** `Pet { id, nome, artigo, raca, porte, obs, cor }`, `Servico { id, nome, precos{pequeno, medio, grande} }`, agenda (dias, horários), etapas do banho, report card, pacote.
Estado no `localStorage` (`pet:estado`): `{ agendamento {petId, servicoId, dia, hora, etapa} | null, usados, ultimoBanho }`.

**Regras (`src/lib/pet.ts`):**
- Preço = tabela do serviço pelo porte do pet. Dias a partir de amanhã, pulando domingo. Horários ocupados por hash da data (estável).
- Ao agendar → WhatsApp + abre "No banho"; etapas avançam sozinhas (simulação). Na última etapa: report card, `usados + 1`, `ultimoBanho = hoje`.
- Próximo banho = último banho + `frequencia_dias`.

**Mensagens:** "Agendamento: {pet} ({porte}), {servico} em {data} às {hora}." / "Estou indo buscar {artigo} {pet}!"

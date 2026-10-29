# SPEC · 10-tatame · Tatame (Arena Mandacaru)

**Telas (hash), alternância Aluno/Professor no topo:** Aluno `#/` Check-in · `#/tatame` Meu tatame. Professor `#/professor` Painel · `#/mensalidades` Mensalidades.

**Modelo de dados:** `Aluno { id, nome, faixa, graus, aulas_desde_grau, dias_sem_treinar, mensalidade{situacao, vence}, presencas_mes[] }`, `faixas[{id, nome, cor, ponta}]`, critério `aulas_por_grau`, `graus_por_faixa`, `dias_para_sumido`.
Check-in no `localStorage` (`tatame:checkin`): `{ dia, extras }` (extras somam às aulas do aluno logado).

**Regras (`src/lib/tatame.ts`):**
- Barra = aulas desde o último grau ÷ aulas por grau; pronto quando atinge o critério. Com todos os graus, o próximo passo é a próxima faixa.
- Prontos para graduar = aulas ≥ critério. Sumidos = dias sem treinar ≥ limite, do mais sumido para o menos.
- Calendário do mês com o check-in de hoje marcado.

**Mensagem:** "Fala, {aluno}! Sentimos sua falta no tatame. Bora voltar essa semana?" (+ lembrete de mensalidade e aviso de graduação, todos editáveis).

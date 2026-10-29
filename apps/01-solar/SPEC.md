# SPEC · 01-solar · Simulador de Economia Solar (Jangada Solar)

**Telas (hash):** `#/` Sua conta · `#/resultado` Resultado · `#/parcela` Parcela x conta · `#/proposta` Quero minha proposta.

**Modelo de dados:** `Simulacao { conta, tipo: 'casa'|'comercio', bairro, prazo }` em memória (sem localStorage: a simulação recomeça a cada visita).
Config: `marca.json` (identidade + WhatsApp), `dados.json` (tipos de imóvel, bairros, limites do slider, prazos), `calculo.json` (parâmetros), `mensagens.json` (template + textos).

**Cálculo (`src/lib/solar.ts`):**
- consumo = conta / tarifa · disponibilidade = 50 kWh (casa) ou 100 kWh (comércio) · compensável = max(0, consumo − disponibilidade)
- geração por kWp = HSP × 30 × fator_perdas · placas = ceil(compensável / geração por kWp / potência do painel) · kWp = placas × painel
- investimento = kWp × custo por kWp · conta com solar = disponibilidade × tarifa + compensável × tarifa × fio B
- economia = conta − conta com solar · payback = investimento / (economia × 12) · 10 anos = soma com reajuste anual
- parcela = Price: investimento × i / (1 − (1 + i)^−n)

**Caso do vídeo:** R$ 480, casa → 7 placas, 3,85 kWp, R$ 13.475, economia R$ 367,63/mês, parcela 60x R$ 351,03.

**Mensagem:** "Olá! Fiz a simulação no site. Conta média de {conta}, {tipo} no bairro {bairro}. Resultado: {placas} placas ({kwp} kWp), economia estimada de {economia}/mês e parcela de {parcela} em {n}x. Quero receber uma proposta. {nome}"

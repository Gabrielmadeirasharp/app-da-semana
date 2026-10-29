# SPEC · 05-festa · Orçamento de Festa (Bambolê Festas)

**Telas (hash):** `#/` Sua festa · `#/pacote` Pacote e tema · `#/extras` Extras · `#/resumo` Resumo. Valor estimado sempre visível na barra de baixo.

**Modelo de dados:** `Festa { tipo, data, adultos, criancas, pacote, tema, extras[] }` em memória.
Pacotes em três formatos (`fixo`, `faixa`, `por_pessoa`), temas `{id, nome, icone, cores[], tipos[]}`, extras `{preco, tipo: fixo|por_convidado}`, `datas_concorridas {dias_semana[], datas[]}`.

**Cálculo (`src/lib/festa.ts`):**
- fixo = preço + max(0, convidados − máximo) × excedente
- faixa = preço da primeira faixa com `convidados <= ate`; acima da última, último preço + excedente por pessoa
- por pessoa = adultos × preço + crianças × preço × fator (abaixo do mínimo, cobra mínimo × preço)
- total = pacote + extras (fixo, ou preço × convidados)
- data concorrida = dia da semana disputado ou data da lista

**Caso do vídeo:** 40 adultos + 20 crianças, Festa Completa (faixa até 60 = R$ 6.200) + animação (R$ 650) + fotografia (R$ 1.200) = R$ 8.050.

**Mensagem:** "Quero um orçamento: {tipo} em {data}, {adultos} adultos e {criancas} crianças. Pacote {pacote}, tema {tema}. Extras: {extras}. Valor estimado: {total}. A data está livre?"

// Mensagem do orçamento para o WhatsApp do buffet
import { moeda } from './format'
import type { Orcamento } from './festa'
import { preencherTemplate } from './whatsapp'

type Dados = { tipo: string; data: string; adultos: number; criancas: number; pacote: string; tema: string; orcamento: Orcamento }

export function montarMensagemOrcamento(template: string, textos: { semExtras: string }, d: Dados): string {
  return preencherTemplate(template, {
    tipo: d.tipo.toLowerCase(),
    data: d.data,
    adultos: d.adultos,
    criancas: d.criancas,
    pacote: d.pacote,
    tema: d.tema,
    extras: d.orcamento.extras.length ? d.orcamento.extras.map((x) => x.rotulo.toLowerCase()).join(', ') : textos.semExtras,
    total: moeda(d.orcamento.total),
  })
}

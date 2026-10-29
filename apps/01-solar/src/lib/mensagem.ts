// Monta a mensagem do WhatsApp a partir do template em mensagens.json
import type { Simulacao } from '../App'
import { getDados, getMensagens } from '../data/repository'
import { moeda, numero } from './format'
import type { ResultadoSolar } from './solar'
import { preencherTemplate } from './whatsapp'

export function montarMensagemProposta(sim: Simulacao, r: ResultadoSolar, parcela: number, nome: string): string {
  const tipo = getDados().tiposImovel.find((t) => t.id === sim.tipo)?.rotulo ?? sim.tipo
  return preencherTemplate(getMensagens().proposta, {
    conta: moeda(sim.conta),
    tipo: tipo.toLowerCase(),
    bairro: sim.bairro,
    placas: r.placas,
    kwp: numero(r.kwp, 2),
    economia: moeda(r.economiaMensal),
    parcela: moeda(parcela),
    n: sim.prazo,
    nome: nome.trim(),
  })
}

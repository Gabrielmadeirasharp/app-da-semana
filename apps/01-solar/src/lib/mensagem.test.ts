import { describe, expect, it } from 'vitest'
import calculo from '../config/calculo.json'
import { montarMensagemProposta } from './mensagem'
import { parcelaPrice, simularSolar } from './solar'

describe('mensagem do WhatsApp', () => {
  it('fluxo do vídeo: R$ 480, casa, 60x', () => {
    const sim = { conta: 480, tipo: 'casa' as const, bairro: 'Messejana', prazo: 60 }
    const r = simularSolar(sim.conta, sim.tipo, calculo)
    const texto = montarMensagemProposta(sim, r, parcelaPrice(r.investimento, calculo.taxa_mensal, 60), 'Gabriel')
    expect(texto).toBe(
      'Olá! Fiz a simulação no site. Conta média de R$ 480,00, casa no bairro Messejana. Resultado: 7 placas (3,85 kWp), economia estimada de R$ 367,63/mês e parcela de R$ 351,03 em 60x. Quero receber uma proposta. Gabriel',
    )
  })
})

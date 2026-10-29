import { describe, expect, it } from 'vitest'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import { diasDeAtendimento, horarioOcupado, precoServico, proximoBanho, restantesNoPacote, type Pet, type Servico } from './pet'
import { preencherTemplate } from './whatsapp'

const [thor, mel] = dados.pets as Pet[]
const [banho] = dados.servicos as Servico[]

describe('agendamento', () => {
  it('preço por porte', () => {
    expect(precoServico(banho, thor.porte)).toBe(55)
    expect(precoServico(banho, mel.porte)).toBe(95)
  })
  it('dias de atendimento pulam domingo', () => {
    // 29/10/2026 é quinta: sex 30, sáb 31, (dom 1 fechado), seg 2...
    expect(diasDeAtendimento(new Date(2026, 9, 29), 3, true)).toEqual(['2026-10-30', '2026-10-31', '2026-11-02'])
  })
  it('horários ocupados são estáveis e nem todos ocupados', () => {
    const livres = dados.agenda.horarios.filter((h) => !horarioOcupado('2026-10-30', h))
    expect(livres.length).toBeGreaterThan(0)
    expect(horarioOcupado('2026-10-30', '08:00')).toBe(horarioOcupado('2026-10-30', '08:00'))
  })
})

describe('pacote e próximo banho', () => {
  it('próximo banho pela frequência', () => {
    expect(proximoBanho('2026-10-30', 7)).toBe('2026-11-06')
  })
  it('restantes do pacote', () => {
    expect(restantesNoPacote(3, 4)).toBe(1)
    expect(restantesNoPacote(5, 4)).toBe(0)
  })
})

describe('mensagens', () => {
  it('agendamento e "estou indo buscar"', () => {
    expect(preencherTemplate(mensagens.agendamento, { pet: 'Thor', porte: 'pequeno', servico: 'banho', data: '30/10', hora: '09:00' })).toBe(
      'Agendamento: Thor (pequeno), banho em 30/10 às 09:00.',
    )
    expect(preencherTemplate(mensagens.buscar, { artigo: 'o', pet: 'Thor' })).toBe('Estou indo buscar o Thor!')
  })
})

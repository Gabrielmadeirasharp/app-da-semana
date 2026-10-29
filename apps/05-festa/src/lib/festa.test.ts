import { describe, expect, it } from 'vitest'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import { dataConcorrida, orcar, precoPacote, type Extra, type Pacote } from './festa'
import { montarMensagemOrcamento } from './mensagem'

const pacotes = dados.pacotes as Pacote[]
const extras = dados.extras as Extra[]
const [essencial, completa, premium] = pacotes

describe('três tipos de pacote', () => {
  it('fixo: valor fechado até o limite e excedente acima', () => {
    expect(precoPacote(essencial, 30, 20)).toBe(3900)
    expect(precoPacote(essencial, 40, 20)).toBe(3900 + 10 * 45)
  })

  it('faixa: pega a faixa de convidados e cobra excedente depois da última', () => {
    expect(precoPacote(completa, 40, 10)).toBe(5400)
    expect(precoPacote(completa, 40, 20)).toBe(6200)
    expect(precoPacote(completa, 40, 21)).toBe(6900)
    expect(precoPacote(completa, 70, 15)).toBe(7600 + 5 * 85)
  })

  it('por pessoa: criança paga meia e respeita o mínimo', () => {
    expect(precoPacote(premium, 40, 20)).toBe(40 * 129 + 20 * 64.5)
    expect(precoPacote(premium, 20, 10)).toBe(50 * 129)
  })
})

describe('orçamento', () => {
  it('caso do vídeo: 60 convidados, pacote do meio, animação + fotografia', () => {
    const o = orcar(completa, 40, 20, extras, ['animacao', 'foto'])
    expect(o.convidados).toBe(60)
    expect(o.pacote).toBe(6200)
    expect(o.total).toBe(6200 + 650 + 1200)
  })

  it('extra por convidado multiplica', () => {
    expect(orcar(completa, 40, 20, extras, ['lembrancinhas']).extras[0].valor).toBe(540)
  })
})

describe('datas', () => {
  it('sábado e datas da lista são concorridas', () => {
    expect(dataConcorrida('2026-12-05', dados.datas_concorridas)).toBe(true) // sábado e na lista
    expect(dataConcorrida('2026-12-13', dados.datas_concorridas)).toBe(true) // domingo na lista
    expect(dataConcorrida('2026-12-10', dados.datas_concorridas)).toBe(false) // quinta
  })
})

describe('mensagem', () => {
  it('traz tipo, data, convidados, pacote, tema, extras e valor', () => {
    const o = orcar(completa, 40, 20, extras, ['animacao', 'foto'])
    const texto = montarMensagemOrcamento(mensagens.orcamento, mensagens.textos, {
      tipo: 'Infantil',
      data: '12/12/2026',
      adultos: 40,
      criancas: 20,
      pacote: 'Festa Completa',
      tema: 'Fundo do mar',
      orcamento: o,
    })
    expect(texto).toBe(
      'Quero um orçamento: infantil em 12/12/2026, 40 adultos e 20 crianças. Pacote Festa Completa, tema Fundo do mar. Extras: animação, fotografia e filmagem. Valor estimado: R$ 8.050,00. A data está livre?',
    )
  })
})

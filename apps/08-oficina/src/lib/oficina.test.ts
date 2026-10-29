import { describe, expect, it } from 'vitest'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import { formatarPlaca, itensComCusto, montarMensagemAprovacao, proximaEtapa, todosDecididos, totalAprovado, type Ordem } from './oficina'

const ordem = dados.ordens[0] as Ordem
const etapas = dados.etapas.map((e) => e.id)

describe('inspeção', () => {
  it('só itens vermelhos e amarelos com custo pedem decisão', () => {
    expect(itensComCusto(ordem.achados).map((a) => a.id)).toEqual(['pastilha', 'oleo', 'pneu', 'palheta'])
  })

  it('total aprovado soma peça + mão de obra', () => {
    const d = { pastilha: 'aprovado', oleo: 'aprovado', pneu: 'recusado' } as const
    expect(totalAprovado(ordem.achados, d)).toBe(189 + 90 + 168 + 40)
    expect(todosDecididos(ordem.achados, d)).toBe(false)
    expect(todosDecididos(ordem.achados, { ...d, palheta: 'recusado' })).toBe(true)
  })

  it('etapas avançam até "pronto" e param', () => {
    expect(proximaEtapa(etapas, 'aguardando')).toBe('servico')
    expect(proximaEtapa(etapas, 'pronto')).toBe('pronto')
  })

  it('placa Mercosul com hífen', () => {
    expect(formatarPlaca('QXB4E21')).toBe('QXB-4E21')
  })
})

describe('mensagem', () => {
  it('fluxo do vídeo: aprova dois itens', () => {
    const d = { pastilha: 'aprovado', oleo: 'aprovado', pneu: 'recusado', palheta: 'recusado' } as const
    expect(montarMensagemAprovacao(mensagens.aprovacao, mensagens.textos.nenhum, ordem, d)).toBe(
      'OS 1234 · Hatch 1.0 2019 prata (QXB-4E21). Aprovo: pastilhas de freio dianteiras, troca de óleo e filtro. Recuso: pneus dianteiros, palhetas do limpador. Total aprovado: R$ 487,00.',
    )
  })
})

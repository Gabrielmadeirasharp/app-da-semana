import { describe, expect, it } from 'vitest'
import dados from '../config/dados.json'
import calculo from '../config/calculo.json'
import mensagens from '../config/mensagens.json'
import { aleatorioComSemente, contarPorStatus, gerarUnidades, simularPagamento, type ConfigEspelho } from './espelho'
import { montarMensagemReserva } from './mensagem'

const cfg = dados as ConfigEspelho
const unidades = gerarUnidades(cfg)

describe('geração do espelho', () => {
  it('cria uma unidade por andar e final de cada bloco', () => {
    expect(unidades).toHaveLength(18 * 4 + 14 * 4)
    expect(unidades.find((u) => u.id === 'A-1402')?.tipologia.id).toBe('2q')
  })

  it('é sempre igual (semente fixa)', () => {
    expect(gerarUnidades(cfg).map((u) => u.status)).toEqual(unidades.map((u) => u.status))
    expect(aleatorioComSemente(1)()).toBe(aleatorioComSemente(1)())
  })

  it('cerca de 40% vendidas', () => {
    const c = contarPorStatus(unidades)
    const pct = c.vendida / unidades.length
    expect(pct).toBeGreaterThan(0.3)
    expect(pct).toBeLessThan(0.5)
    expect(c.disponivel).toBeGreaterThan(0)
  })

  it('preço sobe com o andar', () => {
    const baixo = unidades.find((u) => u.id === 'A-101')!
    const alto = unidades.find((u) => u.id === 'A-1801')!
    expect(alto.preco).toBeGreaterThan(baixo.preco)
    expect(baixo.preco).toBe(902000) // 92 m² × 9.800, arredondado
  })
})

describe('simulação', () => {
  it('entrada + mensais + saldo = preço', () => {
    const s = simularPagamento(700000, 0.2, calculo)
    expect(s.entrada).toBe(140000)
    expect(s.totalMensais).toBe(105000)
    expect(s.saldo).toBe(455000)
    expect(s.mensal).toBeCloseTo(105000 / 26, 2)
    expect(s.parcelaFinanciamento).toBeGreaterThan(4000)
    expect(s.parcelaFinanciamento).toBeLessThan(5000)
  })

  it('mensagem de reserva traz unidade e simulação', () => {
    const u = unidades.find((x) => x.id === 'A-1402')!
    const s = simularPagamento(u.preco, 0.2, calculo)
    const texto = montarMensagemReserva(mensagens.reserva, 'Vértice Cocó', u, s, 'Rafael', 'Marina')
    expect(texto).toContain('unidade 1402 (bloco Torre Parque, 68 m², 2 quartos)')
    expect(texto).toContain('26 mensais de')
    expect(texto).toMatch(/Corretor: Rafael\. Cliente: Marina\.$/)
  })
})

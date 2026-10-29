import { describe, expect, it } from 'vitest'
import calculo from '../config/calculo.json'
import { economiaAcumulada, parcelaPrice, simularSolar } from './solar'

describe('simularSolar', () => {
  // caso usado no vídeo: conta de R$ 480 em casa
  const r = simularSolar(480, 'casa', calculo)

  it('conta de R$ 480 em casa gera 7 placas (3,85 kWp)', () => {
    expect(r.placas).toBe(7)
    expect(r.kwp).toBeCloseTo(3.85, 2)
  })

  it('investimento perto de R$ 13,5 mil', () => {
    expect(r.investimento).toBeCloseTo(13475, 0)
  })

  it('parcela em 60x fica abaixo da conta de R$ 480', () => {
    const parcela = parcelaPrice(r.investimento, calculo.taxa_mensal, 60)
    expect(parcela).toBeLessThan(480)
    expect(parcela).toBeCloseTo(351, 0)
  })

  it('economia mensal desconta taxa mínima e fio B', () => {
    // 480 - 50*0,95 - (505,26-50)*0,95*0,15
    expect(r.economiaMensal).toBeCloseTo(367.63, 1)
    expect(r.paybackAnos).toBeGreaterThan(2.5)
    expect(r.paybackAnos).toBeLessThan(3.5)
  })

  it('comércio usa disponibilidade de 100 kWh', () => {
    expect(simularSolar(480, 'comercio', calculo).disponibilidadeKwh).toBe(100)
  })

  it('conta abaixo da taxa mínima não precisa de placas', () => {
    const pequeno = simularSolar(40, 'casa', calculo)
    expect(pequeno.placas).toBe(0)
    expect(pequeno.economiaMensal).toBe(0)
  })
})

describe('auxiliares', () => {
  it('economia acumulada sem reajuste é linear', () => {
    expect(economiaAcumulada(100, 0, 10)).toBe(12000)
  })
  it('parcela sem juros divide o valor', () => {
    expect(parcelaPrice(1200, 0, 12)).toBe(100)
  })
})

import { describe, expect, it } from 'vitest'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import { agenda, orcar, type Destino, type Escolha, type Extra } from './passeios'
import { montarMensagemReserva } from './mensagem'

const destinos = dados.destinos as Destino[]
const extras = dados.extras as Extra[]
const zonas = dados.zonas_busca
const cumbuco = destinos[0]
const base: Escolha = { adultos: 4, criancas: 0, modalidade: 'compartilhado', extras: [], buscar: false, zona: 'iracema' }

describe('orçamento', () => {
  it('compartilhado: adultos e crianças com preços diferentes', () => {
    expect(orcar(cumbuco, { ...base, adultos: 2, criancas: 2 }, extras, zonas).base).toBe(2 * 90 + 2 * 45)
  })

  it('privativo: buggies arredondados para cima', () => {
    expect(orcar(cumbuco, { ...base, modalidade: 'privativo' }, extras, zonas).base).toBe(450)
    const cinco = orcar(cumbuco, { ...base, adultos: 5, modalidade: 'privativo' }, extras, zonas)
    expect(cinco.buggies).toBe(2)
    expect(cinco.base).toBe(900)
  })

  it('extras por pessoa e por grupo + taxa da zona', () => {
    const o = orcar(cumbuco, { ...base, extras: ['almoco', 'fotos'], buscar: true, zona: 'futuro' }, extras, zonas)
    expect(o.totalExtras).toBe(55 * 4 + 180)
    expect(o.taxaBusca).toBe(30)
    expect(o.total).toBe(360 + 400 + 30)
    expect(o.porPessoa).toBe(790 / 4)
  })

  it('caso do vídeo: Cumbuco, 4 pessoas, busca na Praia do Futuro', () => {
    const o = orcar(cumbuco, { ...base, buscar: true, zona: 'futuro' }, extras, zonas)
    expect(o.total).toBe(390)
  })
})

describe('agenda', () => {
  it('mostra os próximos dias e respeita os dias de operação', () => {
    const dias = agenda(destinos[4], new Date(2026, 9, 29), 14) // Jeri: ter, qui, sáb
    expect(dias).toHaveLength(14)
    expect(dias[0].iso).toBe('2026-10-30')
    expect(dias.filter((d) => d.opera).every((d) => [2, 4, 6].includes(d.data.getDay()))).toBe(true)
  })

  it('é sempre igual para a mesma data e tem algum dia lotado', () => {
    const a = agenda(cumbuco, new Date(2026, 9, 29), 30)
    expect(agenda(cumbuco, new Date(2026, 9, 29), 30)).toEqual(a)
    expect(a.some((d) => d.lotado)).toBe(true)
    expect(a.some((d) => !d.lotado)).toBe(true)
  })
})

describe('mensagem', () => {
  it('traz destino, pessoas, modalidade, busca, extras e total', () => {
    const e: Escolha = { ...base, buscar: true, zona: 'futuro', extras: ['almoco'] }
    const o = orcar(cumbuco, e, extras, zonas)
    const texto = montarMensagemReserva(mensagens.reserva, mensagens.textos, cumbuco, 'sáb., 31/10', e, o, zonas, 'Paula', 'Hotel Atlântico')
    expect(texto).toBe(
      'Quero reservar: Cumbuco em sáb., 31/10, 4 adultos e 0 crianças, passeio compartilhado, busca em Hotel Atlântico, Praia do Futuro. Extras: almoço na barraca. Total estimado: R$ 610,00. Paula',
    )
  })
})

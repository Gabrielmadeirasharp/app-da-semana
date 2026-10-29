import { describe, expect, it } from 'vitest'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import {
  bebidasDaUltimaRodada,
  consumoDaMesa,
  dividirIgual,
  lerMesa,
  montarMensagemPedido,
  somarItem,
  totalComServico,
  totalLinhas,
  type ItemCardapio,
  type Rodada,
} from './mesa'
import { preencherTemplate } from './whatsapp'

const cardapio = dados.cardapio as ItemCardapio[]
const demo: Rodada = { hora: '15:10', itens: dados.rodada_demo }

describe('mesa e carrinho', () => {
  it('lê a mesa da URL', () => {
    expect(lerMesa('?mesa=4')).toBe('4')
    expect(lerMesa('?mesa=<b>12')).toBe('b12')
    expect(lerMesa('')).toBe('')
  })
  it('soma e remove itens', () => {
    let l = somarItem([], 'cerveja', 1)
    l = somarItem(l, 'cerveja', 2)
    expect(l).toEqual([{ id: 'cerveja', qtd: 3 }])
    expect(somarItem(l, 'cerveja', -3)).toEqual([])
  })
})

describe('repetir rodada', () => {
  it('pega só as bebidas da última rodada', () => {
    expect(bebidasDaUltimaRodada([demo], cardapio)).toEqual([
      { id: 'cerveja', qtd: 3 },
      { id: 'agua-coco', qtd: 1 },
    ])
    expect(bebidasDaUltimaRodada([], cardapio)).toEqual([])
  })
})

describe('conta', () => {
  it('soma rodadas e aplica serviço', () => {
    const repetida: Rodada = { hora: '15:40', itens: [{ id: 'cerveja', qtd: 3 }, { id: 'agua-coco', qtd: 1 }] }
    const consumo = consumoDaMesa([demo, repetida])
    expect(consumo.find((l) => l.id === 'cerveja')?.qtd).toBe(6)
    const subtotal = totalLinhas(consumo, cardapio) // 6×16 + 2×9 + 62 + 4×14 = 232
    expect(subtotal).toBe(232)
    expect(totalComServico(subtotal, 0.1)).toEqual({ servico: 23.2, total: 255.2 })
  })
  it('divide por 4 sem perder centavo', () => {
    const partes = dividirIgual(255.2, 4)
    expect(partes).toEqual([63.8, 63.8, 63.8, 63.8])
    const tres = dividirIgual(100, 3)
    expect(tres.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 2)
  })
})

describe('mensagens', () => {
  it('pedido da rodada repetida', () => {
    const texto = montarMensagemPedido(mensagens, '4', [{ id: 'cerveja', qtd: 3 }, { id: 'agua-coco', qtd: 1 }], cardapio)
    expect(texto).toBe('*Mesa 4*\n3x Cerveja 600 ml · R$ 48,00\n1x Água de coco · R$ 9,00\nTotal do pedido: R$ 57,00')
  })
  it('chamar garçom', () => {
    expect(preencherTemplate(mensagens.garcom, { mesa: '4', motivo: 'Gelo' })).toBe('*Mesa 4* pediu: Gelo')
  })
})

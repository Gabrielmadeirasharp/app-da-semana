import { describe, expect, it } from 'vitest'
import dados from '../config/dados.json'
import mensagens from '../config/mensagens.json'
import {
  definirQtd,
  linhasDoPedido,
  pecasDoProduto,
  precoUnitario,
  progressoMinimo,
  proximaFaixa,
  removerCor,
  somarGrade,
  textoGrade,
  totaisDoPedido,
  type Carrinho,
  type Produto,
} from './atacado'
import { montarMensagemPedido } from './mensagem'

const produtos = dados.produtos as Produto[]
const blusa = produtos.find((p) => p.id === 'blusa-ana')!
const vestido = produtos.find((p) => p.id === 'vestido-mucuripe')!

describe('preço por faixa', () => {
  it('usa preço de atacado abaixo da primeira faixa', () => {
    expect(precoUnitario(blusa, 7)).toBe(35)
  })
  it('cai para a faixa alcançada', () => {
    expect(precoUnitario(blusa, 12)).toBe(32)
    expect(precoUnitario(blusa, 30)).toBe(29)
  })
  it('mostra quanto falta para a próxima faixa', () => {
    expect(proximaFaixa(blusa, 8)).toEqual({ faltam: 4, preco: 32 })
    expect(proximaFaixa(blusa, 24)).toBeNull()
  })
})

describe('carrinho', () => {
  it('exemplo da spec: Blusa Ana Azul P2 M2 G2 GG1 = R$ 245', () => {
    let c: Carrinho = {}
    c = somarGrade(c, blusa, 'Azul')
    c = somarGrade(c, blusa, 'Azul')
    c = definirQtd(c, 'blusa-ana', 'Azul', 'GG', 1)
    const [linha] = linhasDoPedido(c, produtos)
    expect(linha.grade).toBe('P2 M2 G2 GG1')
    expect(linha.pecas).toBe(7)
    expect(linha.valor).toBe(245)
  })

  it('faixa considera todas as cores do produto', () => {
    let c: Carrinho = {}
    for (const cor of ['Azul', 'Rosa', 'Off-white']) c = somarGrade(c, blusa, cor)
    expect(pecasDoProduto(c, 'blusa-ana')).toBe(12)
    expect(totaisDoPedido(c, produtos).total).toBe(12 * 32)
  })

  it('zerar e remover limpam o carrinho', () => {
    const c = removerCor(somarGrade({}, vestido, 'Areia'), 'vestido-mucuripe', 'Areia')
    expect(c).toEqual({})
    expect(definirQtd({}, 'x', 'Azul', 'P', 0)).toEqual({})
  })

  it('progresso do pedido mínimo', () => {
    expect(progressoMinimo(370, 600)).toEqual({ falta: 230, percentual: (370 / 600) * 100 })
    expect(progressoMinimo(700, 600)).toEqual({ falta: 0, percentual: 100 })
  })

  it('texto da grade respeita a ordem dos tamanhos', () => {
    expect(textoGrade(['P', 'M', 'G'], { G: 1, P: 3 })).toBe('P3 G1')
  })
})

describe('mensagem', () => {
  it('fluxo do vídeo chega organizado', () => {
    let c: Carrinho = {}
    c = somarGrade(c, blusa, 'Azul')
    c = somarGrade(c, blusa, 'Azul')
    c = somarGrade(c, blusa, 'Rosa')
    c = somarGrade(c, vestido, 'Verde')
    const cliente = { nome: 'Carla', cidade: 'Sobral', uf: 'ce', envio: 'Excursão / ônibus' }
    const texto = montarMensagemPedido(mensagens.pedido, 'Lua de Algodão', cliente, linhasDoPedido(c, produtos))
    expect(texto).toBe(
      [
        '*Pedido de atacado · Lua de Algodão*',
        'Cliente: Carla · Sobral/CE',
        'Envio: Excursão / ônibus',
        '',
        '*Blusa Ana* · Azul: P2 M2 G2 GG2 (8 pç) · R$ 256,00',
        '*Blusa Ana* · Rosa: P1 M1 G1 GG1 (4 pç) · R$ 128,00',
        '*Vestido Mucuripe* · Verde: P1 M1 G1 GG1 (4 pç) · R$ 236,00',
        '',
        'Total: 16 peças · R$ 620,00',
      ].join('\n'),
    )
  })
})
